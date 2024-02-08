import { Track } from "./track";

export interface PlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    },
    followers: {
      href?: string;
      total: number;
    },
    href: string;
    id: string;
    type: string;
    uri: string;
  },
  is_local: boolean;
  track: {
    TrackObject: Track;
  }
}