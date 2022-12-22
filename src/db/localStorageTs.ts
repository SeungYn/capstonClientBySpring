import customStorage, { Key } from './StorageType';

export default class LocalStorageTs implements customStorage {
  clear() {}
  getItem(key: string) {
    return localStorage.getItem(key);
  }
  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string | Object) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
