import { Playlist } from "./playlist";

export interface PlaylistPage {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: Playlist[];
}