export default class KakaoService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async getAllMap(location) {
    console.log(location);
    const data = await this.http.fetch(`/map/hanshin`, {
      method: 'GET',
    });

    return data;
  }
}
