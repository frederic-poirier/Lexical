import React, { memo, useMemo, } from 'react';
import { useSuggestionBus } from './SuggestionEventBus'
import CommandConfig from './SuggestionConfig';

export default function SuggestionComponent() {
    const { isVisible, index, indices, trigger, query } = useSuggestionBus();

    return (
        isVisible &&
        <SuggestionList
            trigger={trigger}
            filteredIndices={indices}
            selectedIndex={index}
            query={query}
        />
    );
}

const SuggestionList = memo(({ trigger, filteredIndices, selectedIndex, query }) => {
    const suggestions = CommandConfig[trigger].suggestions;

    // Grouper les suggestions par catégorie
    const groupedSuggestions = useMemo(() => {
        const groups = {};

        filteredIndices.forEach((originalIndex, displayIndex) => {
            const suggestion = suggestions[originalIndex];
            const category = suggestion.category || 'other';

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push({
                suggestion,
                originalIndex,
                displayIndex,
                isSelected: displayIndex === selectedIndex
            });
        });

        return groups;
    }, [suggestions, filteredIndices, selectedIndex]);

    return (
        <div className="suggestion-list">
            <main>
                {Object.entries(groupedSuggestions).map(([category, items]) => (
                    <div key={category} className="suggestion-category-group">
                        <div className="suggestion-category-header">
                            {category}
                        </div>
                        {items.map(({ suggestion, originalIndex, isSelected }) => (
                            <SuggestionItem
                                key={originalIndex}
                                suggestion={suggestion}
                                isSelected={isSelected}
                            />
                        ))}
                    </div>
                ))}
            </main>
            <footer>
                <span>Ou saissiez '{trigger + query}'</span>
                <kbd>ESC</kbd>
            </footer>
        </div>
    );
});

const SuggestionItem = memo(({ suggestion, isSelected }) => {
    const IconComponent = suggestion.icon;

    return (
        <div className={`suggestion-item ${isSelected ? 'selected' : ''}`}>
            <span className="suggestion-label">{suggestion.label}</span>
            <span className='suggestion-icon'><IconComponent size={14} /></span>
        </div>
    );
});



