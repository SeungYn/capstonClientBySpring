import { Stomp } from '@stomp/stompjs';
import socket from 'socket.io-client';
import SockJS from 'sockjs-client';

export default class StompDI {
  constructor(baseURL, getAccessToken) {
    this.baseURL = baseURL + 'ws-stomp';

    this.getAccessToken = getAccessToken;
    console.log(this.baseURL);
    this.sockjs = new SockJS(this.baseURL);
    console.log(this.sockjs);
    this.client = Stomp.over(new SockJS(baseURL + 'ws-stomp'));
    this.client.connect(
      {
        Authorization: 'Bearer ' + this.getAccessToken(),
      },
      (s) => {
        console.log('서버와 연결되었습니다.');
        console.log(s);
      },
      (e) => {
        console.log(e);
        console.log('서버와 연결이 안됩니다.');
      }
    );
  }

  onConnect() {
    if (!this.client.connected) {
      console.log('연결전');
      console.log(this.baseURL);
      console.log('Bearer ' + this.getAccessToken());
      this.client.connect(
        {
          Authorization: 'Bearer ' + this.getAccessToken(),
        },
        (s) => {
          console.log('서버와 연결되었습니다.');
          console.log(s);
        },
        (e) => {
          console.log(e);
          console.log('서버와 연결이 안됩니다.');
        }
      );
    }
  }

  onDisConnect() {
    return () => {
      this.client.disconnect(() => {
        console.log('연결종료');
      });
    };
  }

  onSubscribe(id, path, callback) {
    let sub = null;
    if (!this.client.connected) {
      this.onConnect();
    }
    sub = this.client.subscribe(`${path}${id}`, callback);
    return () => {
      sub.unsubscribe();
    };
  }

  onSend(path, data) {
    this.client.send(
      path,
      { Authorization: 'Bearer ' + this.getAccessToken },
      JSON.stringify(data)
    );
  }

  onSync(event, callback) {
    if (!this.io.connected) {
      this.io.connect();
    }

    this.io.on(event, (message) => callback(message));
    return () => this.io.off(event);
  }

  onSyncChat(event, callback) {
    //이것때문에 계속 재연결;;
    // if (!this.chatio.connected) {
    //   this.chatio.connect();
    //   console.log('connect재연결');
    // }

    this.chatio.on(event, (message) => callback(message));
    return () => {
      console.log(event, '제거');
      return this.chatio.off(event);
    };
  }

  onConnectChat(partyId) {
    console.log('socket', partyId);
    if (!this.chatio) {
      this.chatio = socket(`${this.baseURL}/room`, {
        auth: (cb) => cb({ token: this.getAccessToken(), partyId }),
      });
      //파티아이디 임시로 auth에 넣어줌 새로고침하면 query가 전달이안됨 우짜지
      console.log('chat connect!');
    }

    return () => {
      console.log('연결종료');
      this.chatio.disconnect();
      this.chatio = null;
      return;
    };
  }
}
