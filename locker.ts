export default class Locker {
  protected _lock: boolean;
  constructor(locked: boolean = false) {
    this._lock = locked;
  }
  lock() {
    this._lock = true;
  }
  unlock() {
    this._lock = false;
  }
  get locked() {
    return this._lock;
  }
}
