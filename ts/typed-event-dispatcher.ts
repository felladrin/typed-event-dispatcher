/** A type definition representing a void function with optional parameter dynamically-typed. */
export type TypedEventListener<T = void> = T extends void
  ? () => void
  : (data: T) => void;

export type TypedEvent<T = void> = {
  /** Adds a listener to the event. */
  addListener(listener: TypedEventListener<T>): void;

  /** Adds a listener to the event, optionally setting it to listen only once. */
  addListener(listener: TypedEventListener<T>, listenOnlyOnce: boolean): void;

  /** Removes a listener, passed by reference. */
  removeListener(listener: TypedEventListener<T>): void;
};

type TypedEventDispatcherExtended<T> = TypedEventDispatcher<T> & {
  listeners: TypedEventListener<T>[];
  oneTimeListeners: boolean[];
};

class TypedEventGetter<T> implements TypedEvent<T> {
  constructor(dispatcher: TypedEventDispatcher<T>) {
    const { addListener, removeListener } = this as TypedEvent<T>;
    this.addListener = addListener.bind(dispatcher);
    this.removeListener = removeListener.bind(dispatcher);
  }

  public addListener(
    this: TypedEventDispatcherExtended<T>,
    listener: TypedEventListener<T>,
    listenOnlyOnce = false
  ): void {
    const { listeners, oneTimeListeners } = this;
    const listenerWasAlreadyAdded = listeners.indexOf(listener) != -1;
    if (listenerWasAlreadyAdded) return;
    listeners.unshift(listener);
    oneTimeListeners.unshift(listenOnlyOnce);
  }

  public removeListener(
    this: TypedEventDispatcherExtended<T>,
    listener: TypedEventListener<T>
  ): void {
    const { listeners, oneTimeListeners } = this;
    const indexOfListener = listeners.indexOf(listener);
    const listenerWasNotAdded = indexOfListener == -1;
    if (listenerWasNotAdded) return;
    listeners.splice(indexOfListener, 1);
    oneTimeListeners.splice(indexOfListener, 1);
  }
}

export class TypedEventDispatcher<T = void> {
  constructor();
  constructor(dispatchedDataSample: T);
  constructor() {
    Object.defineProperties(this, {
      listeners: { value: [] },
      oneTimeListeners: { value: [] },
    });
    this.getter = new TypedEventGetter<T>(this);
  }

  /** Holds the respective TypedEvent of this dispatcher. */
  public readonly getter: TypedEvent<T>;

  /** Dispatches the TypedEvent, optionally passing some data. */
  public dispatch(data: T): void;
  public dispatch(this: TypedEventDispatcherExtended<T>, data: T): void {
    const { listeners, oneTimeListeners } = this;
    for (let index = listeners.length - 1; index >= 0; index--) {
      const listener = listeners[index];
      listener(data);
      const isNotAOneTimeListener = !oneTimeListeners[index];
      if (isNotAOneTimeListener) continue;
      listeners.splice(index, 1);
      oneTimeListeners.splice(index, 1);
    }
  }
}
