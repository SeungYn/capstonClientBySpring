const TOKEN = 'token';
const USERID = 'userID';
const USERNICKNAME = 'userNickName';
export default class TokenStorage {
  saveToken(token) {
    localStorage.setItem(TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  saveUser(user) {
    console.log(user);
    localStorage.setItem(USER, JSON.stringify(user));
    console.log(localStorage.getItem(USER));
  }

  getUser() {
    return JSON.parse(localStorage.getItem(USER));
  }

  clearToken() {
    console.log('토큰삭제');
    localStorage.clear(TOKEN);
  }
  clearUser() {
    console.log('유저삭제');
    localStorage.clear(USER);
  }
}
