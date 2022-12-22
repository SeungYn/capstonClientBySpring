type User = string;
type Token = String;

export type Key = User | Token;

export default interface customStorage {
  clear(): void;
  getItem(key: Key): Object | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}
