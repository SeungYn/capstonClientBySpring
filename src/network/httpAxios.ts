import customStorage from '../db/StorageType';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

export interface ErrorEventBus {
  listen(callback: () => void): void;
  notify(error: Error): void;
}

type ErrorEventBusConstructor = {
  new (): ErrorEventBus;
};

type storageConstructor = {
  new (): customStorage;
};
type Method = 'POST' | 'GET' | 'PUT' | 'DELETE';
export type HttpOptions = {
  body?: string;
  headers?: { [key: string]: string };
  method: Method;
};

export default class HttpClientAxios {
  private client: AxiosInstance;
  constructor(
    private baseURL: string //private authErrorEventBus: ErrorEventBusConstructor, //private storage: storageConstructor
  ) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async fetch(url: string, options: HttpOptions) {
    const { body, method, headers } = options;
    const request: AxiosRequestConfig = {
      url,
      data: body,
      method,
      headers: {
        ...headers,
      },
    };

    try {
      const res = await this.client(request);
      console.log(res);
      if (res.headers.authorization) {
        console.log('헤더에 토큰을 받아옴');
        localStorage.setItem('token', res.headers.authorization.split(' ')[1]);
      }
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
        if (err.response!.status === 401) localStorage.clear();
        const data = err.response!.data;
        const message =
          data && data.message ? data.message : 'Something went wrong! 🤪';

        throw new Error(message);
      }
      throw new Error('connection error');
    }
  }
}
