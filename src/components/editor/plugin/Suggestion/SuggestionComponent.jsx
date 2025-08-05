import { useSuggestionBus, suggestionBus } from './SuggestionEventBus'
import { useEffect, useRef } from 'react';
import CommandConfig from './SuggestionConfig';

export default function SuggestionComponent() {
    const { isVisible, index, list, query } = useSuggestionBus();
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current &&!popupRef.current.contains(event.target)) {
                suggestionBus.emitReplace();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        isVisible && (
            <div ref={popupRef} className="suggestion-menu">
                {list.length > 0 && (
                    <ul>
                        {list.map((element, i) => (
                            <li key={i} className={element === list[index] ? 'selected' : ''}>
                                {element}
                            </li>
                        ))}
                    </ul>
                )}
                <footer>
                Saisissez '{'/' + query}' sur la page <kbd>ESC</kbd>
                </footer>
            </div>
        )
    );
}