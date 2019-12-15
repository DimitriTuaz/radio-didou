import { bind, BindingScope } from '@loopback/core';
import { setIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'

@bind({ scope: BindingScope.TRANSIENT })
export class NowService {

  public static spotify_api_url = 'https://api.spotify.com/v1/me/player';
  public static spotify_token_url = 'https://accounts.spotify.com/api/token';

  private now: any = {};
  private isRunning: boolean = false;
  private intervalID: SetIntervalAsyncTimer;

  private authorization: string = 'M2EyNTdmMzEwNDIyNDkzYzg5NmZhYTcwYzBmODNiZjg6ZjI1OTNmY2YzY2UzNDQ2Nzg0MTM4NDEwMWIxN2FjNjQ=';
  private refresh_token: string = 'AQCacjGQCv1E1d3aB1-ZNsBS_RvmGzT7D_9rKsZiDc9ia2b3WzchsEQsfDJcplc8pSQbpRUPEYuQk4L6dSgSQvWT7fUUvBKnkMgyhqvwxaVfJdJYllCTSBdeGGGSNwr8bMI';

  constructor() {
  }

  public getNow(): any {
    return this.now;
  }

  public start(): void {
    if (!this.isRunning) {
      console.log("[NowService] started");
      this.isRunning = true;
      this.intervalID = setIntervalAsync(
        async () => await this.obtain_access_token(),
        3000
      );
    }
  }

  public async stop(): Promise<void> {
    if (this.isRunning) {
      console.log("[NowService] stopped");
      await clearIntervalAsync(this.intervalID);
      this.isRunning = false;
    }
  }

  private async obtain_access_token(): Promise<void> {
    try {
      const response = await axios({
        method: 'post',
        url: NowService.spotify_token_url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + this.authorization
        },
        data: {
          'grant_type': 'refresh_token',
          'refresh_token': this.refresh_token
        }
      });
      const data = response.data;
      console.log(data);
    }
    catch (error) {
      console.log(error);
    }
  }

  private async obtain_current_playback(): Promise<void> {
    try {
      const response = await axios({
        method: 'post',
        url: '/user/12345',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
      const data = response.data;
      console.log(data);
    }
    catch (error) {
      console.log(error);
    }
  }
}
