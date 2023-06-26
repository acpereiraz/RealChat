import { Author } from './Author.types';

export type ChatMessage = {
    text: string;
    author: Author;
    id?: string;
    socketID?: string;
}