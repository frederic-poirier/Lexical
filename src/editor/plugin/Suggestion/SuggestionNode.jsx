import { TextNode, $createTextNode } from 'lexical';

export class SuggestionNode extends TextNode {

  static getType() {
    return 'suggestionNode';
  }

  static clone(node) {
    return new SuggestionNode(node.__trigger, node.__text, node.__key, node.__ghostText);
  }

  constructor(trigger, text, key, ghostText = '') {
    super(text, key);
    this.__ghostText = ghostText;
    this.__trigger = trigger;
  }

  getTrigger() {
    return this.__trigger;
  }

  setGhostText(text) {
    const writable = this.getWritable();
    writable.__ghostText = text;
    return writable;
  }

  getGhostText() {
    const self = this.getLatest();
    return self.__ghostText;
  }

  createDOM(config) {
    const span = super.createDOM(config);
    span.dataset.ghost = this.__ghostText;
    span.dataset.trigger = this.__trigger;
    span.classList.add('suggestion-node');
    return span;
  }

  updateDOM(prevNode, dom, config) {
    const didUpdate = super.updateDOM(prevNode, dom, config);
    if (prevNode.__ghostText !== this.__ghostText) {
      dom.dataset.ghost = this.__ghostText;
    }
    return didUpdate;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'text', // Force l'export comme TextNode
      text: this.__text, // Seulement le texte visible
    };
  }

  static importJSON(serializedNode) {
    const { text } = serializedNode;
    return $createTextNode(text);
  }

  static isInlineNode() {
    return true;
  }

  static $isSuggestionNode(node) {
    return node instanceof SuggestionNode;
  }
}