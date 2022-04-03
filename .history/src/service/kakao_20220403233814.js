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

  getMapOption(lat, lng) {
    return { center: new this.kakao.maps.LatLng(lat, lng), level: 3 };
  }

  //markerPosition만 넣어주면 수동으로 마커표시, map까지 전달해주면 자동으로 마커표시
  getMapMarker(markerPosition, map) {
    const marker = new this.kakao.maps.Marker({
      position: markerPosition,
      map,
    });
    return marker;
  }

  getDisplayMarker() {}

  getNewMap(mapContainer, mapOption) {
    return new this.kakao.maps.Map(mapContainer, mapOption);
  }

  getLatLng(lat, lng) {
    return new this.kakao.maps.LatLng(lat, lng);
  }

  restaurantsDisplay() {}

  getMarkerImageSize(x, y) {
    return new this.kakao.maps.Size(x, y);
  }
}
