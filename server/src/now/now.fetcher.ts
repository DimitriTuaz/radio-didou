export enum NowEnum {
  None = 0,
  Spotify = 1,
  Deezer = 2,
  Live = 3
}

export abstract class NowFetcher {
  public abstract async fetch(): Promise<void>;
  public abstract name: string;
}
