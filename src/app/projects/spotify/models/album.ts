import { Image } from "./image";

export interface Album {
    album_type: string;
    total_tracks: string;
    available_markets: string[];
    external_urls: { spotify: string; };
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: { reason: string; };
    type: string;
    uri: string;
    copyrights: { text: string; type: string; };
    external_ids: { isrc: string; ean: string; upc: string; };
    genres: string[];
    label: string;
    popularity: number;
    album_group: string;
    artists: {
        external_urls: { spotify: string; };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }
}