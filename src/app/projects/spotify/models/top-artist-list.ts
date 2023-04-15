import { Artist } from "./artist";

export interface TopArtistList {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Artist[];
}