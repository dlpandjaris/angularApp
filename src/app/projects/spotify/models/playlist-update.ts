export interface PlaylistUpdate {
  uris: string[];
  range_start: number;
  insert_before: number;
  range_length: number;
  snapshot_id: string;
}