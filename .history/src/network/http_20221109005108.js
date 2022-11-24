export default class HttpClient {
  constructor(baseURL, authErrorEventBus, tokenStorage) {
    this.baseURL = baseURL;
    this.authErrorEventBus = authErrorEventBus;
    this.tokenStorage = tokenStorage;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (res.headers.get('Authorization')) {
      this.tokenStorage.saveToken(
        res.headers.get('Authorization').split(' ')[1]
      );
    }
    let data;

    try {
      data = await res.json();
    } catch (error) {}

    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : 'Something went wrong! 🤪';

      let error = new Error(message);

      if (res.status === 401) {
        error = new Error('로그인 정보가 잘 못 됐습니다.');
        this.authErrorEventBus.notify(error);
        return;
      }
      if (res.status === 400) {
        error.name = data.code ? data.code : '에러코드 등록 필요';

        throw error;
      }
      throw error;
    }

    return data;
  }

  async fetchText(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    let data;

    try {
      data = await res.text();
    } catch (error) {
      console.error(error);
    }

    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message ? data.message : 'Something went wrong! 🤪';
      const error = new Error(message);
      if (res.status === 401) {
        this.authErrorEventBus.notify(error);
      }
      if (res.status === 400) {
        return data;
      }

      throw error;
    }
    return data;
  }
}
