export default class KakaoService {
  constructor(http, tokenStorage, kakao) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.kakao = kakao;
    console.log(444);
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
  getMapMarker(markerPosition, map, title, image) {
    const marker = new this.kakao.maps.Marker({
      position: markerPosition,
      map,
      title,
      image,
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

  //커스텀 마커
  getMarkerImage(imageSrc, imageSize) {
    return new this.kakao.maps.MarkerImage(imageSrc, imageSize);
  }

  addEventListener(marker, event, action) {
    this.kakao.maps.event.addListener(marker, event, () => {
      action();
    });
  }

  getCustomOverlay(position, content, xAnchor, yAnchor) {
    return new this.kakao.maps.CustomOverlay({
      position,
      content,
      xAnchor,
      yAnchor,
    });
  }

  overlayCustomFunction(data) {
    console.log(data);
  }
}
