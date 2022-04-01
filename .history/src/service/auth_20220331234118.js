export default class AuthService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  async signup(nickname, loginId, password, email, sex, university, dept, sno) {
    const data = await this.http.fetch('/join', {
      method: 'POST',
      body: JSON.stringify({
        nickname,
        password,
        loginId,
        email,
        sex,
        university,
        dept,
        sno,
      }),
    });
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  async idDuplicateVerification(loginId) {
    const data = await this.http.fetch(`/duplicate-loginId`, {
      method: 'POST',
      body: loginId,
      // JSON.stringify({
      //   loginId,
      // }),
    });
    return data;
  }

  //이메일로 인증번호 받기
  async emailVerification(email) {
    const data = await this.http.fetch('/mail-auth', {
      method: 'POST',
      body: email,
      // JSON.stringify({
      //   loginId,
      // }),
    });
    return data;
  }

  //인증번호 확인
  async authenticationNumberVerification(number) {
    const data = await this.http.fetch('/mail-auth', {
      method: 'POST',
      body: number,
      // JSON.stringify({
      //   loginId,
      // }),
    });
    return data;
  }

  async login(nickname, password) {
    const data = await this.http.fetch('/join', {
      method: 'POST',
      body: JSON.stringify({ nickname, password }),
    });
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  async me() {
    const token = this.tokenStorage.getToken();
    return this.http.fetch('/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async logout() {
    this.tokenStorage.clearToken();
  }
}
