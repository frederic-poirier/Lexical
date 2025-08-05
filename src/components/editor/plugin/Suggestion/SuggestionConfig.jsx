const CommandConfig = {
    '/': {
        ghostText: true, // Global pour ce trigger
        placeholder: 'Type to filter commands...',
        suggestions: [
            {
                label: 'Heading 1',
                value: 'h1',
                description: 'Large section heading',
                icon: '📝', // ou 'heading-1' ou un composant
                execute: () => {
                    // Logique pour créer un H1
                    console.log('Creating H1 heading');
                }
            },
            {
                label: 'Paragraph',
                value: 'paragraph',
                description: 'Regular text block',
                icon: '📄',
                execute: () => {
                    // Logique pour créer un paragraphe
                    console.log('Creating paragraph');
                }
            },
            {
                label: 'Bullet List',
                value: 'ul',
                description: 'Unordered list with bullets',
                icon: '•',
                execute: () => {
                    // Logique pour créer une liste
                    console.log('Creating bullet list');
                }
            },
            {
                label: 'Numbered List',
                value: 'ol',
                description: 'Ordered list with numbers',
                icon: '🔢',
                execute: () => {
                    // Logique pour créer une liste numérotée
                    console.log('Creating numbered list');
                }
            },
            {
                label: 'Quote Block',
                value: 'quote',
                description: 'Highlighted quotation',
                icon: '💬',
                execute: () => {
                    // Logique pour créer un blockquote
                    console.log('Creating quote block');
                }
            },
            {
                label: 'Code Block',
                value: 'code',
                description: 'Formatted code snippet',
                icon: '⌨️',
                execute: () => {
                    // Logique pour créer un code block
                    console.log('Creating code block');
                }
            },
            {
                label: 'Divider',
                value: 'hr',
                description: 'Horizontal line separator',
                icon: '➖',
                execute: () => {
                    // Logique pour créer un séparateur
                    console.log('Creating divider');
                }
            }
        ]
    },

    '@': {
        ghostText: false, // Pas de ghost text pour les mentions
        placeholder: 'Mention someone...',
        suggestions: [
            {
                label: 'John Doe',
                value: '@johndoe',
                description: 'john.doe@company.com',
                icon: '👤',
                execute: (value) => {
    // Logique pour insérer une mention
    console.log('Mentioning:', value);
}
      },
{
    label: 'Jane Smith',
        value: '@janesmith',
            description: 'jane.smith@company.com',
                icon: '👤',
                    execute: ( value) => {
        // Logique pour insérer une mention
        console.log('Mentioning:', value);
    }
},
{
    label: 'Development Team',
        value: '@dev-team',
            description: 'All developers',
                icon: '👥',
                    execute: (value) => {
        // Logique pour mentionner un groupe
        console.log('Mentioning team:', value);
    }
}
    ]
  },

'#': {
    ghostText: true,
        placeholder: 'Add a tag...',
            suggestions: [
                {
                    label: 'urgent',
                    value: '#urgent',
                    description: 'High priority item',
                    icon: '🔥',
                    execute: (value) => {
                    // Logique pour ajouter un tag
                    console.log('Adding tag:', value);
                }
      },
{
    label: 'bug',
        value: '#bug',
            description: 'Bug report or issue',
                icon: '🐛',
                    execute: (value) => {
        console.log('Adding bug tag:', value);
    }
},
{
    label: 'feature',
        value: '#feature',
            description: 'New feature request',
                icon: '✨',
                    execute: (value) => {
        console.log('Adding feature tag:', value);
    }
},
{
    label: 'documentation',
        value: '#docs',
            description: 'Documentation related',
                icon: '📚',
                    execute: (value) => {
        console.log('Adding docs tag:', value);
    }
}
    ]
  }
};

export default CommandConfig;