import { Author } from './Author.types';

export type ChatMessage = {
    color: string;
    text: string;
    author: Author;
    id?: string;
    socketID?: string;
}