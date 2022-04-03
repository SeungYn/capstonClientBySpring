export default class KakaoService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async getAllMap(location) {
    const data = await this.http.fetch(`/map/한신대`, {
      method: 'GET',
    });

    console.log(data);
  }
}
