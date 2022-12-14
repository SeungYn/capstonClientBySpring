const TOKEN = 'token';
const USERID = 'userID';
const USER = 'user';
const USERNICKNAME = 'userNickName';
export default class TokenStorage {
  saveToken(token) {
    localStorage.setItem(TOKEN, token);
  }

  saveUserId(userId) {
    localStorage.setItem(USERID, userId);
  }

  saveUserNickName(userNickName) {
    localStorage.setItem(USERNICKNAME, userNickName);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  getUserNickName() {
    return localStorage.getItem(USERNICKNAME);
  }

  getUserId() {
    return localStorage.getItem(USERID);
  }

  clearToken() {
    console.log('토큰삭제');
    localStorage.clear(TOKEN);
  }
  clearUserId() {
    console.log('유저아이디삭제');
    localStorage.clear(USERID);
  }
  clearUserNickName() {
    console.log('유저닉네임삭제');
    localStorage.clear(USERNICKNAME);
  }

  saveUser(user) {
    console.log(user);
    localStorage.setItem(USER, JSON.stringify(user));
    console.log(localStorage.getItem(USER));
  }

  getUser() {
    return JSON.parse(localStorage.getItem(USER));
  }

  clearUser() {
    console.log('유저삭제');
    localStorage.clear(USER);
  }
}
