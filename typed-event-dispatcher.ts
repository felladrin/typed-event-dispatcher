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
  database: { listener: TypedEventListener<T>; listenOnlyOnce: boolean }[];
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
    const { database } = this;
    if (!database.some((record) => record.listener == listener))
      database.unshift({ listener, listenOnlyOnce });
  }

  public removeListener(
    this: TypedEventDispatcherExtended<T>,
    listener: TypedEventListener<T>
  ): void {
    const { database } = this;
    const index = database.findIndex((record) => record.listener == listener);
    if (index >= 0) database.splice(index, 1);
  }
}

export class TypedEventDispatcher<T = void> {
  constructor();
  constructor(dispatchedDataSample: T);
  constructor() {
    Object.defineProperties(this, { database: { value: [] } });
    this.getter = new TypedEventGetter<T>(this);
  }

  /** Holds the respective TypedEvent of this dispatcher. */
  public readonly getter: TypedEvent<T>;

  /** Dispatches the TypedEvent, optionally passing some data. */
  public dispatch(data: T): void;
  public dispatch(this: TypedEventDispatcherExtended<T>, data: T): void {
    const { database } = this;
    for (let index = database.length - 1; index >= 0; index--) {
      const { listener, listenOnlyOnce } = database[index];
      listener(data);
      if (listenOnlyOnce) database.splice(index, 1);
    }
  }
}
