export default class KakaoService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async getAllMap(location) {
    const data = http.fetch(`/map/한신대`);
    console.log(data);
  }
}
