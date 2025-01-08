export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

export interface Voice {
  name: string;
  lang: string;
}
