import socket from 'socket.io-client';

export default class Socket {
  constructor(baseURL, getAccessToken) {
    this.chat = this.chat = socket(baseURL, {
      auth: (cb) => cb({ token: getAccessToken() }),
    });

    this.io = socket(baseURL, {
      auth: (cb) => cb({ token: getAccessToken() }),
    });
    console.log(
      socket(baseURL, {
        auth: { token: getAccessToken() },
      })
    );
    this.io.on('connext_error', (err) => {
      console.log('socket error', err.message);
    });
  }

  onSync(event, callback) {
    if (!this.io.connected) {
      this.io.connect();
    }

    this.io.on(event, (message) => callback(message));
    return () => this.io.off(event);
  }
}
