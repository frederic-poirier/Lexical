import { TextNode } from 'lexical';

export class SuggestionNode extends TextNode {

  static getType() {
    return 'suggestionNode';
  }

  static clone(node) {
    return new SuggestionNode(node.__text, node.__key, node.__ghostText);
  }

  constructor(text, key, ghostText = '') {
    super(text, key);
    this.__ghostText = ghostText;
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

  static importJSON(serializedNode) {
    // Pour un node temporaire, on peut retourner null ou un TextNode normal
    const { text } = serializedNode;
    return new TextNode(text);
  }

  isInert() {
    return true; // Indique que ce node ne doit pas affecter l'historique
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'text', // Exporter comme TextNode normal pour éviter la persistance
      text: this.__text,
    };
  }

  // Méthode utilitaire pour vérifier si c'est un SuggestionNode
  static $isSuggestionNode(node) {
    return node instanceof SuggestionNode;
  }
}