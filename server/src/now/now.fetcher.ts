import { model, property } from "@loopback/repository";

export enum NowEnum {
  None = 0,
  Spotify = 1,
  Deezer = 2,
}

@model()
export class NowObject {
  type: NowEnum;
  @property({ required: true }) listeners: number;
  @property({ required: true }) song: string;
  @property.array(String, { required: true }) artists: string[];
  @property() album?: string;
  @property() release_date?: string;
  @property() cover?: string;
  @property() url?: string;
}

export abstract class NowFetcher {
  public now: NowObject;
  public abstract async fetch(): Promise<void>;
  public abstract name: string;
}
