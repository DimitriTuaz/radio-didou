import { INow } from "@common/now/now.common";

export abstract class NowFetcher {
  public now: INow;
  public abstract async fetch(): Promise<void>;
  public abstract name: string;
}
