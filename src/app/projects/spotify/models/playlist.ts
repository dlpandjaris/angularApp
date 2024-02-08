import { Image } from "./image";
import { PlaylistTrack } from "./playlist-track";

export interface Playlist {
  collaborative: string;
  description: string;
  external_urls: {
    spotify: string;
  }
  followers: {
    href: string;
    total: number;
  }
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    }
    followers: {
      href: string;
      total: number;
    }
    href: string;
    id: string;
    type: string;
    url: string;
    display_name: string;
  }
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: PlaylistTrack[];
  };
  type: string;
  uri: string;
}