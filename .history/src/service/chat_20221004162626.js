export default class ChatService {
  constructor(http, tokenStorage, stomp) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.stomp = stomp;
  }

  async getMyInfo() {
    const data = await this.http.fetch(`/auth/info`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return data;
  }

  async getChats(partyId) {
    const data = await this.http.fetch(`/chat/${partyId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return data;
  }

  async creatChat(partyId, chat) {
    const data = await this.http.fetch(`/chat/${partyId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        chat,
      }),
    });
    return data;
  }
  onConnect() {
    this.stomp.onConnect();
  }

  onDisConnect() {
    console.log('종료밖');
    return this.stomp.onDisConnect();
  }

  /**
   *
   * @param {챗팅방아이디} id
   * @param {구독경로} path
   * @param {구독시 서버에서 데이터가 오면 처리하는 함수} callback
   * @returns 구독취소함수
   */
  onSubscribe(id, path, callback) {
    return this.stomp.onSubscribe();
  }

  onSend(path, data) {
    this.stomp.onSend(path, data);
  }
  // onConnectChat(partyId) {
  //   return this.socket.onConnectChat(partyId);
  // }
  // onChatSync(event, callback) {
  //   return this.socket.onSyncChat(event, callback);
  // }
  // onSync(event, callback) {
  //   return this.socket.onSync(event, callback);
  // }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return { Authorization: `Bearer ${token}` };
  }
}
