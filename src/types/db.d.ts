export interface LibraryTrack {
  id?: number;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  file?: File;
  fileName: string;
  fileData: ArrayBuffer;
  src?: string;
  url?: string;
  type?: string;
}

export interface QueueTrack {
  id?: number;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  fileName: string;
  fileData: ArrayBuffer;
  src?: string;
  url?: string;
  type?: string;
}

export interface Playlist {
  id?: number;
  name: string;
  tracks: number[]; // Track IDs
}

export interface Setting {
  key: string;
  value: any;
}
