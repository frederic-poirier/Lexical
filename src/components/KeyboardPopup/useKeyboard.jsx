
import { useState } from "react";

export function useKeyboard(initialState = 'closed') {
    const [popupState, setPopupState] = useState(initialState);

    return {
        popupState,
        setPopupState,
        
        // Méthodes de convenance
        open: () => setPopupState('visible'),
        expand: () => setPopupState('expanded'),
        close: () => setPopupState('closed'),
        
        // États dérivés
        isOpen: popupState !== 'closed',
        isExpanded: popupState === 'expanded'
    };
}