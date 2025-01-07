export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Voice {
  name: string;
  lang: string;
}
