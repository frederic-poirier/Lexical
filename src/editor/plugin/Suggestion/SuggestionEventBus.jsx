import { useState, useEffect } from 'react'

class SuggestionEventBus extends EventTarget {
    constructor() {
        super();
        this.currentState = {
            isVisible: false,
            nodeKey: '',
            query: '',
            index: null,
            indices: [],
            fail: 0
        };
    }

    emit(eventName, data) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }

    on(eventName, callback) {
        this.addEventListener(eventName, callback)
        return () => this.removeEventListener(eventName, callback);
    }

    updateState(updates) {
        const oldState = { ...this.currentState };
        this.currentState = { ...this.currentState, ...updates };

        if (this.currentState.query !== undefined && this.currentState.query !== oldState.query) {
            this.emit('query-changed');
        }

        if (this.currentState.index !== undefined && this.currentState.index !== oldState.index) {
            this.emit('index-changed');
        }

        this.emit('state-changed', {
            oldState, newState: this.currentState
        });
    }

    getState() {
        return { ...this.currentState };
    }

    emitRemove() {
        this.emit('remove', null);
    }

    emitReplace() {
        this.emit('replace', null);
    }
}

export const suggestionBus = new SuggestionEventBus();

export function useSuggestionBus(selector) {
    const [state, setState] = useState(() => suggestionBus.getState());
    useEffect(() => {
        const handleStateChange = (event) => {
            setState(event.detail.newState);
        }
        const cleanup = suggestionBus.on('state-changed', handleStateChange);
        return cleanup;
    }, [])
    return selector ? selector(state) : state;
}