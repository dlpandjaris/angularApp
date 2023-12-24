import { Device } from "./device"
import { Episode } from "./episode";
import { Track } from "./track";

export interface PlaybackState {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    }
    uri: string;
  }
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  // item: Track | Episode;
  item: Track;
  currently_playing_type: string;
  actions: {
    interrupting_playback: boolean;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggle_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  }
}