export enum NowEnum {
  None = 0,
  Spotify = 1,
  Deezer = 2,
}

export interface INow {
  type: NowEnum;
  song: string;
  artists: string[];
  album?: string;
  release_date?: string;
  cover?: string;
  url?: string;
}
