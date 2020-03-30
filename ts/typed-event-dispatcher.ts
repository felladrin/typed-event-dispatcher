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
  oneTimeListeners: TypedEventListener<T>[];
};

class TypedEventGetter<T> implements TypedEvent<T> {
  constructor(dispatcher: TypedEventDispatcher<T>) {
    this.addListener = (this as TypedEvent<T>).addListener.bind(dispatcher);
    this.removeListener = (this as TypedEvent<T>).removeListener.bind(
      dispatcher
    );
  }

  public addListener(
    this: TypedEventDispatcherExtended<T>,
    listener: TypedEventListener<T>,
    listenOnlyOnce = false
  ): void {
    const { listeners, oneTimeListeners } = this;
    listeners.push(listener);
    if (listenOnlyOnce) oneTimeListeners.push(listener);
  }

  public removeListener(
    this: TypedEventDispatcherExtended<T>,
    listener: TypedEventListener<T>
  ): void {
    const { listeners } = this;
    const indexOfListener = listeners.indexOf(listener);
    if (indexOfListener >= 0) listeners.splice(indexOfListener, 1);
  }
}

export class TypedEventDispatcher<T = void> {
  /** Holds the respective TypedEvent of this dispatcher. */
  public readonly getter: TypedEvent<T>;

  constructor();
  constructor(dispatchedDataSample: T);
  constructor() {
    Object.defineProperties(this, {
      listeners: { value: [] },
      oneTimeListeners: { value: [] },
    });
    this.getter = new TypedEventGetter<T>(this);
  }

  /** Dispatches the TypedEvent, optionally passing some data. */
  public dispatch(data: T): void;
  public dispatch(this: TypedEventDispatcherExtended<T>, data: T): void {
    const { listeners, oneTimeListeners, getter } = this;
    for (const listener of listeners) listener(data);
    while (oneTimeListeners.length > 0)
      getter.removeListener(oneTimeListeners.pop() as TypedEventListener<T>);
  }
}
