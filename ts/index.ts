export type TypedEventListener<T> = (data?: T) => void;

export type TypedEvent<T = void> = {
    addListener(listener: TypedEventListener<T>, listenOnlyOnce?: boolean): void;
    removeListener(listener: TypedEventListener<T>): void;
}

export class TypedEventDispatcher<T = void> {
    private readonly listeners: TypedEventListener<T>[] = [];
    private readonly oneTimeListeners: TypedEventListener<T>[] = [];

    public dispatch(data?: T): void {
        this.callListeners(data);
        this.wipeOneTimeListeners();
    }

    public get getter(): TypedEvent<T> {
        const typedEvent: TypedEvent<T> = {
            addListener: this.addListener,
            removeListener: this.removeListener
        };
        Object.defineProperties(typedEvent, {
            listeners: { value: this.listeners },
            oneTimeListeners: { value: this.oneTimeListeners }
        });
        return typedEvent;
    }

    private addListener(listener: TypedEventListener<T>, listenOnlyOnce = false): void {
        this.listeners.push(listener);
        if (listenOnlyOnce) this.oneTimeListeners.push(listener);
    }

    private removeListener(listener: TypedEventListener<T>): void {
        const indexOfListener = this.listeners.indexOf(listener);
        if (indexOfListener >= 0) this.listeners.splice(indexOfListener, 1);
    }

    private callListeners(data?: T): void {
        this.listeners.forEach(listener => listener.call(listener, data));
    }

    private wipeOneTimeListeners(): void {
        this.oneTimeListeners.forEach(listener => this.removeListener(listener));
        while (this.oneTimeListeners.length > 0) this.oneTimeListeners.pop();
    }
}
