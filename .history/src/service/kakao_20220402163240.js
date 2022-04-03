export default class KakaoService {
  constructor(http, tokenStorage, kakao) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.kakao = kakao;
  }

  async getAllMap(location) {
    console.log(location);
    const data = await this.http.fetch(`/map/hanshin`, {
      method: 'GET',
    });

    return data;
  }

  async test() {
    const data = await this.http.fetch('/user', {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return data;
  }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  mapOption(lat, lng) {
    return { center: new kakao.maps.LatLng(lat, lng), level: 3 };
  }
}
