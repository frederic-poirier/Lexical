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
} from 'lexical';

import { SuggestionNode } from './SuggestionNode';
import { suggestionBus, useSuggestionBus } from './SuggestionEventBus';
import './Suggestion.css'

const suggestions = ['il reste à faire', 'ENTER / EXECUTION', 'liste plus complète', 'gestion undo et redo', 'positionnement firefox'];

export function SuggestionPlugin({ trigger = '/', CommandConfig = {} }) {
    const [editor] = useLexicalComposerContext();
    const { isVisible } = useSuggestionBus();

    useKeyboardCommands(editor, trigger, isVisible);
    useNodeTransforms(editor, trigger)
    useEventHandlers(editor, trigger);

    return null;
}

function useKeyboardCommands(editor, trigger, isVisible) {
    useEffect(() => {
        const unregistrerKeyDown = editor.registerCommand(
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

                    const domElement = editor.getElementByKey(node.getKey());
                    const rect = domElement ? domElement.getBoundingClientRect() : null;

                    suggestionBus.updateState({
                        isVisible: true,
                        query: suggestionNode.__text,
                        nodeKey: suggestionNode.getKey(),
                        currentNode: suggestionNode,
                        rect: rect,
                        list: suggestions, // Initialiser la liste complète
                        index: null,
                        fail: 0
                    })
                });

                return true;
            },
            COMMAND_PRIORITY_HIGH
        );


        const unregistrerEscape = editor.registerCommand(
            KEY_ESCAPE_COMMAND, () => {
                if (!isVisible) return false;

                return editor.update(() => {
                    if (SuggestionNode.$isSuggestionNode(suggestionBus.getState().currentNode)) suggestionBus.emitReplace();
                    return true;
                });
            }, COMMAND_PRIORITY_HIGH);


        const unregistrerTab = editor.registerCommand(
            KEY_TAB_COMMAND, (e) => {
                if (!isVisible) return false;

                const state = suggestionBus.getState();
                if (state.currentNode && state.list && state.index !== null) {
                    e.preventDefault();
                    editor.update(() => {
                        state.currentNode.setTextContent(trigger + state.list[state.index]);
                        state.currentNode.selectEnd();
                        suggestionBus.updateState({ query: state.list[state.index] });
                    });
                    return true;
                }
                return false;

            }, COMMAND_PRIORITY_HIGH
        )


        const handleArrowNavigation = (direction) => (event) => {
            if (!isVisible) return false;

            event.preventDefault();
            const currentState = suggestionBus.getState();
            if (!currentState.list || currentState.list.length === 0) return true;

            const currentIndex = currentState.index ?? 0;
            const listLength = currentState.list.length;

            const nextIndex = direction === 'down'
                ? (currentIndex + 1) % listLength
                : (currentIndex - 1 + listLength) % listLength;

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
            unregistrerKeyDown();
            unregistrerEscape();
            unregistrerTab();
            unregistrerDown();
            unregistrerUp();
        }
    }, [editor, isVisible, trigger]);

}


function useNodeTransforms(editor, trigger) {
    useEffect(() => {
        return editor.registerNodeTransform(SuggestionNode, (node) => {
            const content = node.getTextContent();
            const currentState = suggestionBus.getState();

            if (!content.startsWith(trigger)) return suggestionBus.emitReplace();
            if (currentState.fail >= 5) return suggestionBus.emitReplace();


            const query = content.slice(trigger.length);
            const filteredSuggestions = suggestions.filter(word =>
                word.toLowerCase().startsWith(query.toLowerCase())
            );

            const hasResults = filteredSuggestions.length > 0;
            const newFail = hasResults ? 0 : currentState.fail + 1;

            if (newFail >= 5) return suggestionBus.emitReplace();

            let newIndex;

            if (!hasResults || query.length === 0) newIndex = null;
            else if (currentState.index === null || currentState.index >= filteredSuggestions.length) newIndex = 0;
            else newIndex = currentState.index;

            const listChanged = JSON.stringify(currentState.list) !== JSON.stringify(filteredSuggestions);
            const indexChanged = currentState.index !== newIndex;
            const queryChanged = currentState.query !== query;
            const failChanged = currentState.fail !== newFail;

            if (listChanged || indexChanged || queryChanged || failChanged) {
                suggestionBus.updateState({
                    isVisible: true,
                    query: query,
                    list: filteredSuggestions,
                    index: newIndex,
                    fail: newFail,
                });
            }
        });
    }, [editor, trigger]);
}


function useEventHandlers(editor, trigger) {
    useEffect(() => {
        const updateGhostText = () => {
            editor.update(() => {
                const state = suggestionBus.getState();
                const placeholder = 'filter'


                if (!state.nodeKey) return;

                const lexicalNode = $getNodeByKey(state.nodeKey);
                if (!SuggestionNode.$isSuggestionNode(lexicalNode)) return;


                const query = state.query;
                const suggestion = state.list[state.index];
                let newGhostText;


                if (query.length === 0) newGhostText = placeholder
                else if (state.index === null) newGhostText = ''
                else newGhostText = suggestion.slice(query.length)

                if (lexicalNode.getGhostText() !== newGhostText) {
                    lexicalNode.setGhostText(newGhostText);
                }
            });
        };

        const removeHandler = () => {
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

        const replaceHandler = () => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

                const node = selection.anchor.getNode();
                if (SuggestionNode.$isSuggestionNode(node)) {
                    const text = node.getTextContent();
                    const textNode = $createTextNode(text);
                    node.replace(textNode);
                    suggestionBus.updateState({ isVisible: false });
                }
            });
        };

        const cleanupMutation = editor.registerMutationListener(SuggestionNode, (mutations) => {
            for (const [NodeKey, mutation] of mutations.entries()) {
                if (mutation === 'destroyed') {
                    suggestionBus.updateState({ isVisible: false });
                }
            }
        });

        const cleanupRemove = suggestionBus.on('remove', removeHandler);
        const cleanupReplace = suggestionBus.on('replace', replaceHandler);
        const cleanupUpdateGhostText = suggestionBus.on('state-changed', updateGhostText);


        return () => {
            cleanupRemove();
            cleanupReplace();
            cleanupUpdateGhostText();
            cleanupMutation();
        };
    }, [editor, trigger]);
}