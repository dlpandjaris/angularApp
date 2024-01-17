export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void; // whatever type you want to give. (any,number,float etc)
    Spotify: any;
  }
}