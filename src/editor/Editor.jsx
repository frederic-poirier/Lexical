import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import './Editor.css'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { SuggestionPlugin } from './plugin/Suggestion/SuggestionPlugin'
import { SuggestionNode } from './plugin/Suggestion/SuggestionNode'
import SuggestionComponent from './plugin/Suggestion/SuggestionComponent'
import CommandConfig from './plugin/Suggestion/SuggestionConfig'
import AbreviationPlugin from './plugin/ABVR/AbreviationPlugin'
import AbreviationComponent from './plugin/ABVR/AbreviationComponent'

const theme = {
    suggestionNode: 'text-suggestion-node',
};
function onError(error) {
    console.error(error);
}

export default function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        nodes: [SuggestionNode],
        onError,
    }

    return (
        <>
            <div id='editor-container'>
                <LexicalComposer initialConfig={initialConfig}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className='editor'
                                placeholder={
                                    <div className='editor-placeholder'>
                                        Type here
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <SuggestionPlugin CommandConfig={CommandConfig} />
                    <HistoryPlugin />
                    <AbreviationPlugin  />
                    
                </LexicalComposer>
                <SuggestionComponent />
            </div>
        </>

    )
}