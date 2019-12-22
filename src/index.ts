type TypedEventListener<T> = (data?: T) => void;

export type TypedEvent<T = void> = {
  addListener(listener: TypedEventListener<T>, listenOnlyOnce?:boolean): void;
  removeListener(listener: TypedEventListener<T>): void;
}

export class TypedEventDispatcher<T = void> {
  private readonly listeners: Array<TypedEventListener<T>> = [];
  private readonly oneTimeListeners: Array<TypedEventListener<T>> = [];

  public get getter(): TypedEvent<T> {
    const typedEvent:TypedEvent<T> = {
      addListener: this.addListener,
      removeListener: this.removeListener
    };
    Object.defineProperties(typedEvent, {
      listeners: { value: this.listeners },
      oneTimeListeners: { value: this.oneTimeListeners }
    });
    return typedEvent;
  }

  public addListener(listener: TypedEventListener<T>, listenOnlyOnce = false): void {
    this.listeners.push(listener);
    if (listenOnlyOnce) {
      this.oneTimeListeners.push(listener);
    }
  }

  public removeListener(listener: TypedEventListener<T>): void {
    const indexOfListener = this.listeners.indexOf(listener);
    if (indexOfListener >= 0) {
      this.listeners.splice(indexOfListener, 1);
    }
  }

  public dispatch(data?: T): void {
    this.callListeners(data);
    this.wipeOneTimeListeners();
  }

  private callListeners(data?: T): void {
    for (const listener of this.listeners) {
      listener.call(listener, data);
    }
  }

  private wipeOneTimeListeners(): void {
    while (this.oneTimeListeners.length > 0) {
      const listener = this.oneTimeListeners.pop() as TypedEventListener<T>;
      this.removeListener(listener);
    }
  }
}
