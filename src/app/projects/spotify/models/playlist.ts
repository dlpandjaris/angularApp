import { Image } from "./image";
import { Track } from "./track";

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
  tracks: Track[];
  type: string;
  uri: string;
}