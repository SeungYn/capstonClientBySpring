const partys = [
  {
    id: 22,
    restaurant: '그라찌에 한신대경삼과점',
    title: '컴공만들어와',
    status: 'NON_MATCHED',
    maximumCount: 4,
    currentCount: 1,
    createdAt: '2022-06-05',
    members: [
      {
        id: 14,
        nickName: '테스트4',
        sex: 'male',
        dept: '컴공',
        sno: 17,
        reliabiltiy: 0,
        owner: true,
        ready: false,
      },
      {
        id: 15,
        nickName: '테스트4',
        sex: 'female',
        dept: '컴공',
        sno: 17,
        reliabiltiy: 0,
        owner: true,
        ready: false,
      },
      {
        id: 16,
        nickName: '테스트4',
        sex: 'female',
        dept: '컴공',
        sno: 17,
        reliabiltiy: 0,
        owner: true,
        ready: false,
      },
    ],
  },
];

export default class PartyService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  //스프링 서버 /user/restaurant/${id}
  //노드 서버 /party/${id}
  async getPartyByRestaurantId(id) {
    const data = await this.http.fetch(`/party/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    console.log(data);
    console.log(data.length);
    return data;
  }

  //스프링 서버 /user/restaurant/party/${id}/join

  async makePartyByRestaurantId(id, title, count) {
    const data = await this.http.fetch(`/user/restaurant/party/${id}/join`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        title,
        maximumCount: count,
      }),
    });
    console.log(data);
    return data;
  }

  // 파티만들기
  // 노드 서버 /party/makeParty2/:resId
  async makePartyByRestaurantId2(title, maximumCount, clickedRestaurantId) {
    const data = await this.http.fetch(
      `/party/makeParty2/${clickedRestaurantId}`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          title,
          maximumCount,
        }),
      }
    );
    console.log(data);
  }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
