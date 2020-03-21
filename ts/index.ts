export type TypedEventListener<T> = (data: T) => void;

export type TypedEvent<T> = {
  addListener: (listener: TypedEventListener<T>, listenOnlyOnce?: boolean) => void;
  removeListener: (listener: TypedEventListener<T>) => void;
};

type TypedEventDispatcherExtended<T> = TypedEventDispatcher<T> & {
  listeners: TypedEventListener<T>[];
  oneTimeListeners: TypedEventListener<T>[];
};

function addListener<T>(listener: TypedEventListener<T>, listenOnlyOnce?: boolean): void;
function addListener<T>(this: TypedEventDispatcherExtended<T>, listener: TypedEventListener<T>, listenOnlyOnce = false): void {
  const { listeners, oneTimeListeners } = this;
  listeners.push(listener);
  if (listenOnlyOnce) oneTimeListeners.push(listener);
}

function removeListener<T>(listener: TypedEventListener<T>): void;
function removeListener<T>(this: TypedEventDispatcherExtended<T>, listener: TypedEventListener<T>): void {
  const { listeners } = this;
  const indexOfListener = listeners.indexOf(listener);
  if (indexOfListener >= 0) listeners.splice(indexOfListener, 1);
}

export class TypedEventDispatcher<T = undefined> {
  constructor() {
    Object.defineProperties(this, {
      listeners: { value: [] },
      oneTimeListeners: { value: [] }
    });
  }

  public readonly getter: TypedEvent<T> = {
    addListener: addListener.bind(this),
    removeListener: removeListener.bind(this)
  };

  public dispatch(): void;
  public dispatch(data: T): void;
  public dispatch(this: TypedEventDispatcherExtended<T>, data?: T): void {
    const { listeners, oneTimeListeners, getter } = this;
    listeners.forEach(listener => listener.call(listener, data as T));
    while (oneTimeListeners.length > 0) getter.removeListener(oneTimeListeners.pop() as TypedEventListener<T>);
  }
}
