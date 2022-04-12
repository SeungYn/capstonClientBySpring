export default class PartyService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async getPartyByRestaurantId(id) {
    const data = await this.http.fetch(`/party/${id}`, {
      method: 'GET',
    });
    console.log(data);
    return data;
  }
}
