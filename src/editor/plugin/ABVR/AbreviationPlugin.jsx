import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { KEY_SPACE_COMMAND, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react"

const STORAGE_KEY = 'dictionnaire-abreviations';

// Dictionnaire par défaut
const dictionnaireParDefaut = new Map([
    ['prsn', 'personne'],
    ['dsgn', 'design'],
    ['cad', "c'est à dire"],
    ["abvr", 'abreviation'],
    ['qsc', "qu'est-ce que"]
]);

export default function AbreviationPlugin() {
    const [editor] = useLexicalComposerContext();
    const [dictionnaire, setDictionnaire] = useState(new Map());
    const [maxLength, setMaxLength] = useState(0);

    // Charger le dictionnaire depuis localStorage au montage
    useEffect(() => {
        const chargerDictionnaire = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            let loadedDictionnaire;
            
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    loadedDictionnaire = new Map(Object.entries(parsed));
                } catch (error) {
                    console.error('Erreur chargement dictionnaire:', error);
                    loadedDictionnaire = dictionnaireParDefaut;
                }
            } else {
                loadedDictionnaire = dictionnaireParDefaut;
            }
            
            setDictionnaire(loadedDictionnaire);
            // Recalculer maxLength
            const newMaxLength = loadedDictionnaire.size > 0 
                ? Math.max(...Array.from(loadedDictionnaire.keys()).map(key => key.length)) + 1
                : 0;
            setMaxLength(newMaxLength);
        };

        chargerDictionnaire();

        // Écouter les changements de localStorage (autres onglets)
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY) {
                chargerDictionnaire();
            }
        };

        // Écouter les changements internes (même onglet)
        const handleDictionaryUpdate = () => {
            chargerDictionnaire();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('abbreviation-dictionary-updated', handleDictionaryUpdate);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('abbreviation-dictionary-updated', handleDictionaryUpdate);
        };
    }, []);

    useEffect(() => {
        // Ne pas enregistrer la commande si le dictionnaire n'est pas encore chargé
        if (dictionnaire.size === 0) return;

        const unregistrerSpace = editor.registerCommand(KEY_SPACE_COMMAND, () => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

            const anchor = selection.anchor;
            const node = anchor.getNode();
            const offset = anchor.offset;
            const text = node.getTextContent();
            let lastSpaceOffset = text.lastIndexOf(' ', offset - 1); // offset - 1 pour ne pas compter l'espace qu'on vient de taper

            // Si pas d'espace trouvé et qu'il n'y a pas assez de caractère dans le node
            // regarde si il y a un previous siblings ou s'il sagit d'un début de ligne.
            if (lastSpaceOffset === -1 && offset < maxLength) {
                if (node?.getPreviousSibling()) return false;
                else lastSpaceOffset = 0;
            }

            if (offset - lastSpaceOffset > maxLength) return false;

            // Extraire le mot (en excluant l'espace de début si présent)
            const wordStart = lastSpaceOffset === 0 ? 0 : lastSpaceOffset + 1;
            const word = text.slice(wordStart, offset).trim();
            
            if (!word) return false;

            const fullForm = dictionnaire.get(word.toLowerCase());

            if (fullForm) {
                editor.update(() => {
                    // Remplacer le mot par sa forme complète
                    node.spliceText(wordStart, word.length, fullForm, true);
                });
                return true; // Empêcher le comportement par défaut
            }

            return false;
        }, COMMAND_PRIORITY_LOW);

        return unregistrerSpace;
    }, [editor, dictionnaire, maxLength]);

    // Retourner null car ce plugin n'a pas d'UI
    return null;
}