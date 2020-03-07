export type TypedEventListener<T> = (data?: T) => void;

export type TypedEvent<T = void> = {
    addListener(listener: TypedEventListener<T>, listenOnlyOnce?: boolean): void;
    removeListener(listener: TypedEventListener<T>): void;
};

export class TypedEventDispatcher<T = void> {
    public readonly dispatch: (data?: T) => void;
    public readonly getter: TypedEvent<T>;

    constructor() {
        const listeners: TypedEventListener<T>[] = [];
        const oneTimeListeners: TypedEventListener<T>[] = [];

        this.getter = {
            addListener(listener: TypedEventListener<T>, listenOnlyOnce = false): void {
                listeners.push(listener);
                if (listenOnlyOnce) oneTimeListeners.push(listener);
            },

            removeListener(listener: TypedEventListener<T>): void {
                const indexOfListener = listeners.indexOf(listener);
                if (indexOfListener >= 0) listeners.splice(indexOfListener, 1);
            }
        };

        this.dispatch = (data?: T) => {
            listeners.forEach(listener => listener.call(listener, data));
            oneTimeListeners.forEach(listener => this.getter.removeListener(listener));
            while (oneTimeListeners.length > 0) oneTimeListeners.pop();
        };

        [this, this.getter].forEach(object => {
            Object.keys(object).forEach(property => {
                Object.defineProperty(object, property, {
                    writable: false, configurable: false
                });
            });
        });
    }
}
