export enum NowEnum {
  None = 0,
  Spotify = 1,
  Deezer = 2,
}

export interface INow {
  type: NowEnum;
  artists?: string;
  album?: string;
  song?: string;
}
