type TypedEventListener<T> = (data?: T) => void;

export abstract class TypedEvent<T = void> {
  protected listeners: Array<TypedEventListener<T>> = [];
  protected oneTimeListeners: Array<TypedEventListener<T>> = [];

  public addListener(
    listener: TypedEventListener<T>,
    listenOnlyOnce = false
  ): void {
    this.listeners.push(listener);
    if (listenOnlyOnce) {
      this.oneTimeListeners.push(listener);
    }
  }

  public removeListener(listener: TypedEventListener<T>): void {
    this.listeners = this.listeners.filter(item => item != listener);
  }
}

export class TypedEventDispatcher<T = void> extends TypedEvent<T> {
  public get getter(): TypedEvent<T> {
    return this as TypedEvent<T>;
  }

  public dispatch(data?: T): void {
    for (const listener of this.listeners) {
      listener.call(listener, data);
    }
    this.wipeOneTimeListeners();
  }

  private wipeOneTimeListeners(): void {
    this.listeners = this.listeners.filter(
      item => this.oneTimeListeners.indexOf(item) == -1
    );
    this.oneTimeListeners = [];
  }
}
