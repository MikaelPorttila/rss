export interface Composer {
  onOpenTag: (node: OpenTag) => void;
  onCloseTag: (nodeName: string) => void;
  onAttribute: (attr: Attribute) => void;
  onValueNode: (text: string) => void;
}

export interface Attribute {
  name: string;
  value: string;
}

export interface OpenTag {
  name: string;
  attributes: {};
  isSelfClosing: boolean;
}
