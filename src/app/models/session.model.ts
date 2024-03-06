import { Snippet } from "./snippet.model";

export interface Session {
    name: string,
    bpm: number,
    type: string,
    length: number,
    snippets: Snippet[],
}