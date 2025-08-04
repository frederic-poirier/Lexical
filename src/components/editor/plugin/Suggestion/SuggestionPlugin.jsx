import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createTextNode,
    $getSelection,
    $isRangeSelection,
    $getNodeByKey,
    COMMAND_PRIORITY_HIGH,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_DOWN_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_TAB_COMMAND,
    KEY_ENTER_COMMAND,
} from 'lexical';

import { SuggestionNode } from './SuggestionNode';
import { suggestionBus, useSuggestionBus } from './SuggestionEventBus';
import './Suggestion.css'

const suggestions = ['Title', 'Paragraph', 'Unoredered list', 'Ordered list', 'Block quote', 'Block code', 'Pinterest board'];


// SuggestionPlugin enregistre les hooks nécessaires au fonctionnement du système de suggestion.
// Il initialise les raccourcis clavier (`useKeyboardCommands`), les transformations sur le node (`useNodeTransforms`)
// et les gestionnaires d’événements/mutations (`useEventHandlers`).

export function SuggestionPlugin({ trigger = '/', CommandConfig = {} }) {
    const [editor] = useLexicalComposerContext();
    const { isVisible } = useSuggestionBus();

    useKeyboardCommands(editor, trigger, isVisible);
    useNodeTransforms(editor, trigger)
    useEventHandlers(editor, trigger);

    return null;
}


// useKeyboardCommands enregistre les raccourcis clavier principaux liés à l'interaction
// avec le SuggestionNode : déclenchement, navigation, autocomplétion, validation, annulation.
//
// 1. unregistrerTrigger : insère un SuggestionNode lorsque la touche correspondant au `trigger` est
//    pressée, sans combinaison (ctrl, shift...) et entourée d'espaces ou de vide. Cela évite les insertions
//    involontaires.
//
// 2. unregistrerEscape : remplace le SuggestionNode par un TextNode standard lorsque Escape est pressé,
//    à condition qu’un SuggestionNode soit visible. Cela déclenche un événement 'replace'.
//
// 3. unregistrerTab : applique l’autocomplétion en remplaçant le contenu du SuggestionNode par la suggestion
//    sélectionnée (`state.list[state.index]`), puis place le curseur à la fin. Cela déclenche une mise à jour
//    de l’état via le MutationObserver.
//
// 4. unregistrerEnter : exécute la commande associée à la suggestion sélectionnée et retire le SuggestionNode
//    en émettant un événement 'remove'.
//
// 5. handleArrowNavigation (+ unregistrerDown / unregistrerUp) : gère le changement d’index dans la liste de
//    suggestions via les flèches haut/bas. Si aucun index n’est défini, l’index devient 0 (bas) ou dernier (haut).
//    Chaque changement déclenche un événement 'index-changed' qui met à jour le ghost text.


function useKeyboardCommands(editor, trigger, isVisible) {
    useEffect(() => {
        const unregistrerTrigger = editor.registerCommand(
            KEY_DOWN_COMMAND,
            (event) => {
                if (event.key !== trigger || (event.key === trigger && (event.shiftKey || event.ctrlKey || event.metaKey))) return false;

                editor.update(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

                    const anchor = selection.anchor;
                    const node = anchor.getNode();
                    const offset = anchor.offset;
                    const text = node.getTextContent();

                    if (offset > 0 && text[offset - 1] !== ' ') return
                    if (offset !== 0 && text[offset] && text[offset] !== ' ') return;

                    event.preventDefault();
                    const suggestionNode = new SuggestionNode(trigger, undefined, '');
                    selection.insertNodes([suggestionNode])
                    suggestionNode.select()
                });

                return true;
            },
            COMMAND_PRIORITY_HIGH
        )

        const unregistrerEscape = editor.registerCommand(
            KEY_ESCAPE_COMMAND, () => {
                if (!isVisible) return false;

                return editor.update(() => {
                    if (SuggestionNode.$isSuggestionNode(suggestionBus.getState().currentNode)) {
                        suggestionBus.emitReplace();
                    }
                    return true;
                });
            }, COMMAND_PRIORITY_HIGH
        )

        const unregistrerTab = editor.registerCommand(
            KEY_TAB_COMMAND, (e) => {
                if (!isVisible) return false;

                const state = suggestionBus.getState();
                if (state.list && state.index !== null) {
                    e.preventDefault();
                    editor.update(() => {
                        state.currentNode.setTextContent(trigger + state.list[state.index]);
                        state.currentNode.selectEnd();
                    });
                    return true;
                }
                return false;

            }, COMMAND_PRIORITY_HIGH
        )

        const unregistrerEnter = editor.registerCommand(
            KEY_ENTER_COMMAND, (e) => {
                if (!isVisible) return false

                const state = suggestionBus.getState();
                if (state.currentNode && state.list && state.index !== null) {
                    e.preventDefault();
                    console.log('Commande exécuter de:', state.list[state.index])
                    suggestionBus.emitRemove();
                    return true
                }
                return false
            }, COMMAND_PRIORITY_HIGH
        )


        const handleArrowNavigation = (direction) => (event) => {
            if (!isVisible) return false;

            event.preventDefault();
            const currentState = suggestionBus.getState();
            if (!currentState.list || currentState.list.length === 0) return true;

            const listLength = currentState.list.length;
            let nextIndex;

            if (currentState.index === null) nextIndex = direction === 'down' ? 0 : listLength - 1;
            else nextIndex = direction === 'down'
                ? (currentState.index + 1) % listLength
                : (currentState.index - 1 + listLength) % listLength;

            suggestionBus.updateState({ index: nextIndex });
            return true;
        };

        const unregistrerDown = editor.registerCommand(
            KEY_ARROW_DOWN_COMMAND,
            handleArrowNavigation('down'),
            COMMAND_PRIORITY_HIGH
        );

        const unregistrerUp = editor.registerCommand(
            KEY_ARROW_UP_COMMAND,
            handleArrowNavigation('up'),
            COMMAND_PRIORITY_HIGH
        );


        return () => {
            unregistrerTrigger();
            unregistrerEscape();
            unregistrerTab();
            unregistrerEnter();
            unregistrerDown();
            unregistrerUp();
        }
    }, [editor, isVisible, trigger]);

}


// useNodeTransforms attache une transformation au SuggestionNode qui s’exécute à chaque mutation.
// Elle vérifie deux choses :
// - que le contenu commence toujours par le `trigger` (sinon le node est remplacé),
// - que le nombre d’échecs successifs (`fail`) n’excède pas un seuil (ici 5), auquel cas le node est aussi supprimé.


function useNodeTransforms(editor, trigger) {
    useEffect(() => {
        return editor.registerNodeTransform(SuggestionNode, (node) => {
            const content = node.getTextContent();
            const currentState = suggestionBus.getState();
            if (!content.startsWith(trigger)) return suggestionBus.emitReplace();
            if (currentState.fail >= 5) return suggestionBus.emitReplace();
        }, [editor, trigger]);
    })
}


function useEventHandlers(editor, trigger) {
    const updateGhostText = useGhostTextHandler(editor);
    useSuggestionEventListeners(editor, updateGhostText);
    useSuggestionMutationObserver(editor, trigger, updateGhostText);
}


// useGhostTextHandler met à jour le texte d'autocomplétion (ghost text) affiché via CSS ::before,
// en utilisant la méthode setGhostText du SuggestionNode.
//
// Si aucun texte n’a été saisi et qu’aucune suggestion n’est sélectionnée, on affiche un placeholder.
// Sinon, on affiche la fin de la suggestion sélectionnée (en excluant les lettres déjà tapées).
// Si le ghost text calculé est identique à celui déjà présent, il n’est pas réappliqué.


function useGhostTextHandler(editor) {
    editor.update(() => {
        const state = suggestionBus.getState();
        const placeholder = 'filter';

        if (!state.nodeKey) return;
        const lexicalNode = $getNodeByKey(state.nodeKey);
        if (!SuggestionNode.$isSuggestionNode(lexicalNode)) return;

        const query = state.query;
        const list = state.list;
        const index = state.index;

        let newGhostText = '';
        if (query.length === 0 && index === null) newGhostText = placeholder
        else newGhostText = list[index]?.slice(query.length)

        if (lexicalNode.getGhostText() !== newGhostText) {
            lexicalNode.setGhostText(newGhostText);
        }
    });
}

// useSuggestionEventListeners ajoute des listeners pour les événements personnalisés émis par le bus,
// notamment :
//
// 1. 'remove' : supprime complètement le SuggestionNode (sans laisser de texte).
// 2. 'replace' : remplace le SuggestionNode par un TextNode contenant son contenu actuel.
// 3. 'query-changed' et 'index-changed' : déclenchent une mise à jour du ghost text via updateGhostText.


function useSuggestionEventListeners(editor, updateGhostText) {
    useEffect(() => {
        const handleRemove = () => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
                const node = selection.anchor.getNode();
                if (SuggestionNode.$isSuggestionNode(node)) {
                    node.remove();
                    suggestionBus.updateState({ isVisible: false });
                }
            });
        };

        const handleReplace = () => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
                const node = selection.anchor.getNode();
                if (SuggestionNode.$isSuggestionNode(node)) {
                    const textNode = $createTextNode(node.getTextContent());
                    node.replace(textNode);
                    suggestionBus.updateState({ isVisible: false });
                }
            });
        };

        const cleanupRemove = suggestionBus.on('remove', handleRemove);
        const cleanupReplace = suggestionBus.on('replace', handleReplace);
        const cleanupQuery = suggestionBus.on('query-changed', updateGhostText);
        const cleanupIndex = suggestionBus.on('index-changed', updateGhostText);

        return () => {
            cleanupRemove();
            cleanupReplace();
            cleanupQuery();
            cleanupIndex();
        };
    }, [editor, updateGhostText]);
}


// useSuggestionMutationObserver surveille les mutations appliquées aux SuggestionNode.
// Selon le type de mutation (created, updated, destroyed), elle adapte l'état de l'autocomplétion
// et synchronise l'interface.
//
// - destroyed : le node a été supprimé, on met isVisible à false.
//
// - created :
//     - calcule la position du DOM pour affichage si nécessaire,
//     - filtre les suggestions en fonction de la query (contenu après le trigger),
//     - initialise l’état global du bus (query, liste, index=null, fail=0),
//     - déclenche un premier ghost text.
//
// - updated :
//     - recalcule la query et filtre les suggestions,
//     - met à jour l’état du bus uniquement si la liste, l’index, la query ou le compteur d’échecs change.
//       Cela limite les mises à jour inutiles.
//     - L’index est remis à 0 si l’ancien n’est plus valide, ou laissé inchangé si encore pertinent.

function useSuggestionMutationObserver(editor, trigger, updateGhostText) {
    useEffect(() => {
        const cleanup = editor.registerMutationListener(SuggestionNode, (mutations) => {
            for (const [nodeKey, mutation] of mutations.entries()) {
                if (mutation === 'destroyed') {
                    suggestionBus.updateState({ isVisible: false });
                    return;
                }

                editor.getEditorState().read(() => {
                    const node = $getNodeByKey(nodeKey);
                    if (!SuggestionNode.$isSuggestionNode(node)) return;

                    const content = node.getTextContent();
                    const query = content.slice(trigger.length);
                    const currentState = suggestionBus.getState();

                    if (mutation === 'created') {
                        const domElement = editor.getElementByKey(nodeKey);
                        const rect = domElement?.getBoundingClientRect() ?? null;
                        const list = query.length
                            ? suggestions.filter(word =>
                                word.toLowerCase().startsWith(query.toLowerCase()))
                            : suggestions;

                        suggestionBus.updateState({
                            isVisible: true,
                            query,
                            nodeKey,
                            currentNode: node,
                            rect,
                            list,
                            index: null,
                            fail: 0
                        });
                        editor.update(updateGhostText);
                    }

                    if (mutation === 'updated') {
                        if (query === currentState.query) return;

                        const filteredSuggestions = suggestions.filter(word =>
                            word.toLowerCase().startsWith(query.toLowerCase()));
                        const hasResults = filteredSuggestions.length > 0;
                        const newFail = hasResults ? 0 : currentState.fail + 1;

                        let newIndex;
                        if (!hasResults || query.length === 0) newIndex = null;
                        else if ((currentState.index === null && query.length > 0) || currentState.index >= filteredSuggestions.length) {
                            newIndex = 0;
                        } else newIndex = currentState.index;

                        suggestionBus.updateState({
                            isVisible: true,
                            query,
                            list: filteredSuggestions,
                            index: newIndex,
                            fail: newFail,
                        });
                    }
                });
            }
        });

        return cleanup;
    }, [editor, trigger, updateGhostText]);
}
