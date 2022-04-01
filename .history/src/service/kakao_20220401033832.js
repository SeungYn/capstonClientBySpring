export default class KakaoService {
  constructor(http) {
    this.http = http;
    this.tokenStorage = tokenStorage;
	}
	
	async getAllMap(location) {
		const data = http.fetch(`/map/`)
	}
}
