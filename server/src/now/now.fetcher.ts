export enum NowEnum {
  None = 0,
  Spotify = 1,
  Deezer = 2,
}

export interface INow {
  type: NowEnum;
  listeners: number;
  song: string;
  artists: string[];
  album?: string;
  release_date?: string;
  cover?: string;
  url?: string;
}

export abstract class NowFetcher {
  public now: INow;
  public abstract async fetch(): Promise<void>;
  public abstract name: string;
}
