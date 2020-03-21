export type TypedEventListener<T> = T extends void ? () => void : (data: T) => void;

export type TypedEvent<T> = Event<T>;

type TypedEventDispatcherExtended<T> = TypedEventDispatcher<T> & {
  listeners: TypedEventListener<T>[];
  oneTimeListeners: TypedEventListener<T>[];
};

class Event<T> {
  constructor(dispatcher: TypedEventDispatcher<T>) {
    this.addListener = this.addListener.bind(dispatcher);
    this.removeListener = this.removeListener.bind(dispatcher);
  }

  public addListener(listener: TypedEventListener<T>, listenOnlyOnce?: boolean): void;
  public addListener(this: TypedEventDispatcherExtended<T>, listener: TypedEventListener<T>, listenOnlyOnce = false): void {
    const { listeners, oneTimeListeners } = this;
    listeners.push(listener);
    if (listenOnlyOnce) oneTimeListeners.push(listener);
  }

  public removeListener(listener: TypedEventListener<T>): void;
  public removeListener(this: TypedEventDispatcherExtended<T>, listener: TypedEventListener<T>): void {
    const { listeners } = this;
    const indexOfListener = listeners.indexOf(listener);
    if (indexOfListener >= 0) listeners.splice(indexOfListener, 1);
  }
}

export class TypedEventDispatcher<T = void> {
  constructor() {
    Object.defineProperties(this, {
      listeners: { value: [] },
      oneTimeListeners: { value: [] }
    });
  }

  public readonly getter: TypedEvent<T> = new Event<T>(this);

  public dispatch(data: T): void;
  public dispatch(this: TypedEventDispatcherExtended<T>, data: T): void {
    const { listeners, oneTimeListeners, getter } = this;
    listeners.forEach(listener => listener(data));
    while (oneTimeListeners.length > 0) getter.removeListener(oneTimeListeners.pop() as TypedEventListener<T>);
  }
}
