export default class HttpClient {
  constructor(baseURL, authErrorEventBus) {
    this.baseURL = baseURL;
    this.authErrorEventBus = authErrorEventBus;
  }

  async fetch(url, options) {
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    console.log(res);
    let data;
    console.log('resstatus', res.status);
    try {
      data = await res.json();
    } catch (error) {
      console.error(error);
    }

    if (res.status > 299 || res.status < 200) {
      console.log('승유');
      const message =
        data && data.message ? data.message : 'Something went wrong! 🤪';
      const error = new Error(message);
      console.error('error = ', error);

      if (res.status === 401) {
        this.authErrorEventBus.notify(error);
      }
      if (res.status === 400) {
        error.name = data.code ? data.code : '에러코드 등록 필요';
        console.log(error.message);
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
