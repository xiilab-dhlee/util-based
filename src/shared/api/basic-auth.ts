import type { AxiosInstance } from "axios";
import axios from "axios";

export class BasicAuthAxiosService {
  private axios: AxiosInstance | null = null;

  connect(username: string, password: string) {
    this.axios = this.initialize(username, password);
  }

  initialize(username: string, password: string) {
    // Base64로 인코딩된 username:password
    const encodedCredentials = btoa(`${username}:${password}`);

    const _axios = axios.create({
      headers: { "Content-Type": "application/json" },
    });

    _axios.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Basic ${encodedCredentials}`;
        }

        return config;
      },
      (error) => {
        console.log(error);
        return Promise.reject(error);
      },
    );

    return _axios;
  }

  public getAxios() {
    return this.axios;
  }
}
