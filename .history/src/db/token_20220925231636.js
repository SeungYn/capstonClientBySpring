const TOKEN = 'token';
const USERID = 'userID';
export default class TokenStorage {
  saveToken(token) {
    localStorage.setItem(TOKEN, token);
  }

  saveUserId(userId) {
    localStorage.setItem(USERID, userId);
  }

  getToken() {
    return localStorage.getItem(TOKEN);
  }

  getUserId() {
    return localStorage.getItem(USERID);
  }

  clearToken() {
    localStorage.clear(TOKEN);
  }
}
