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

type TypedEventDispatcherDatabase<T> = {
  listener: TypedEventListener<T>;
  listenOnlyOnce?: boolean;
}[];

function addListener<T>(
  database: TypedEventDispatcherDatabase<T>,
  listener: TypedEventListener<T>,
  listenOnlyOnce?: boolean
): void {
  if (!database.some((record) => record.listener == listener))
    database.unshift({ listener: listener, listenOnlyOnce: listenOnlyOnce });
}

function removeListener<T>(
  database: TypedEventDispatcherDatabase<T>,
  listener: TypedEventListener<T>
): void {
  for (let index = database.length - 1; index >= 0; index--) {
    if (database[index].listener == listener) database.splice(index, 1);
  }
}

function dispatch<T>(database: TypedEventDispatcherDatabase<T>, data: T): void {
  for (let index = database.length - 1; index >= 0; index--) {
    const { listener, listenOnlyOnce } = database[index];
    listener(data);
    if (listenOnlyOnce) database.splice(index, 1);
  }
}

export class TypedEventDispatcher<T = void> {
  constructor();
  constructor(dispatchedDataSample: T);
  constructor() {
    const database: TypedEventDispatcherDatabase<T> = [];
    this.getter = {
      addListener: (
        listener: TypedEventListener<T>,
        listenOnlyOnce = false
      ): void => addListener(database, listener, listenOnlyOnce),
      removeListener: (listener: TypedEventListener<T>): void =>
        removeListener(database, listener),
    };
    this.dispatch = (data: T): void => dispatch(database, data);
  }

  /** Holds the respective TypedEvent of this dispatcher. */
  public readonly getter: TypedEvent<T>;

  /** Dispatches the TypedEvent, optionally passing some data. */
  public dispatch: (data: T) => void;
}
