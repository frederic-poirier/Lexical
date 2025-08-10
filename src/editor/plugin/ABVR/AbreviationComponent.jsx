import { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import "./Abreviation.css";

const STORAGE_KEY = 'dictionnaire-abreviations';

// Dictionnaire par défaut
const dictionnaireParDefaut = new Map([
    ['prsn', 'personne'],
    ['dsgn', 'design'],
    ['cad', "c'est à dire"],
    ["abvr", 'abréviation'],
    ['qsc', "qu'est-ce que"]
]);

export default function AbreviationComponent() {
    const [visible, setVisible] = useState(false);
    const [dictionnaire, setDictionnaire] = useState(new Map());

    // Charger depuis localStorage au montage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDictionnaire(new Map(Object.entries(parsed)));
            } catch (error) {
                console.error('Erreur chargement dictionnaire:', error);
                setDictionnaire(dictionnaireParDefaut);
            }
        } else {
            setDictionnaire(dictionnaireParDefaut);
        }
    }, []);

    // Sauvegarder dans localStorage
    const sauvegarder = (nouvelleDictionnaire) => {
        setDictionnaire(nouvelleDictionnaire);
        const obj = Object.fromEntries(nouvelleDictionnaire);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        
        // Notifier les autres composants (comme le plugin) du changement
        window.dispatchEvent(new CustomEvent('abbreviation-dictionary-updated'));
    };

    // Ajouter ou modifier une abréviation
    const onSave = (short, full) => {
        const nouvelleDictionnaire = new Map(dictionnaire);
        nouvelleDictionnaire.set(short, full);
        sauvegarder(nouvelleDictionnaire);
    };

    // Supprimer une abréviation
    const onDelete = (short) => {
        const nouvelleDictionnaire = new Map(dictionnaire);
        nouvelleDictionnaire.delete(short);
        sauvegarder(nouvelleDictionnaire);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setVisible((prev) => !prev)}
                className="abbreviation-trigger"
            >
                <MdSettings size={16} />
            </button>
            
            {visible && (
                <div className="abbreviation-panel">
                    <header className="abbreviation-header">
                        <h3>Gestion des abréviations</h3>
                    </header>
                    
                    <main className="abbreviation-main">
                        <ul className="abbreviation-list">
                            {/* Afficher les abréviations existantes */}
                            {Array.from(dictionnaire.entries()).map(([short, full]) => (
                                <AbreviationInput
                                    key={short}
                                    short={short}
                                    full={full}
                                    onSave={onSave}
                                    onDelete={onDelete}
                                />
                            ))}
                            
                            {/* Ligne pour ajouter une nouvelle abréviation */}
                            <AbreviationInput
                                key="nouvelle"
                                short=""
                                full=""
                                onSave={onSave}
                                onDelete={onDelete}
                            />
                        </ul>
                    </main>
                </div>
            )}
        </div>
    );
}

const AbreviationInput = ({ short = '', full = '', onSave, onDelete }) => {
    const [shortValue, setShortValue] = useState(short);
    const [fullValue, setFullValue] = useState(full);
    
    // Réinitialiser les valeurs si les props changent
    useEffect(() => {
        setShortValue(short);
        setFullValue(full);
    }, [short, full]);

    // Vérifier si les valeurs ont changé
    const hasChanged = shortValue !== short || fullValue !== full;
    // Vérifier si c'est un nouvel item
    const isNew = short === '' && full === '';
    
    const handleSubmit = () => {
        const trimmedShort = shortValue.trim();
        const trimmedFull = fullValue.trim();
        
        if (trimmedShort && trimmedFull) {
            onSave(trimmedShort, trimmedFull);
            // Si c'était un nouvel item, reset les champs
            if (isNew) {
                setShortValue('');
                setFullValue('');
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <li className="abbreviation-item">
            <input 
                type="text" 
                placeholder="abvr" 
                value={shortValue}
                maxLength={4}
                onChange={(e) => setShortValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="abbreviation-input abbreviation-input-short"
            />
            <input 
                type='text' 
                placeholder='abréviation complète' 
                value={fullValue}
                onChange={(e) => setFullValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="abbreviation-input abbreviation-input-full"
            />
            
            {/* Afficher le bouton seulement si modifié OU si c'est un nouvel item avec du contenu */}
            {(hasChanged || (isNew && shortValue.trim() && fullValue.trim())) && (
                <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="abbreviation-btn abbreviation-btn-save"
                >
                    {isNew ? 'Ajouter' : 'Modifier'}
                </button>
            )}
            
            {!isNew && (
                <button 
                    onClick={() => onDelete(short)}
                    className="abbreviation-btn abbreviation-btn-delete"
                >
                    ✕
                </button>
            )}
        </li>
    );
};