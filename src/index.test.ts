import {TypedEvent, TypedEventDispatcher} from "./index";

type Player = {
    name: string;
    level: number;
    isAlive: boolean;
};

class App {
    private onServerStartedDispatcher = new TypedEventDispatcher();
    private onPlayersCountUpdatedDispatcher = new TypedEventDispatcher<number>();
    private onDebugModeToggledDispatcher = new TypedEventDispatcher<boolean>();
    private onPlayerConnectedDispatcher = new TypedEventDispatcher<Player>();

    public get onServerStarted() { return this.onServerStartedDispatcher.getter; }
    public get onPlayersCountUpdated() { return this.onPlayersCountUpdatedDispatcher.getter; }
    public get onDebugModeToggled() { return this.onDebugModeToggledDispatcher.getter; }
    public get onPlayerConnected() { return this.onPlayerConnectedDispatcher.getter; }

    public dispatchServerStarted() {
        this.onServerStartedDispatcher.dispatch();
    }

    public dispatchPlayersCountUpdated() {
        this.onPlayersCountUpdatedDispatcher.dispatch(32);
    }

    public dispatchDebugModeToggled() {
        this.onDebugModeToggledDispatcher.dispatch(true);
    }

    public dispatchPlayerConnected() {
        this.onPlayerConnectedDispatcher.dispatch({name: "TS", level: 7, isAlive: true});
    }
}

let app: App;
let listener: jest.Mock;

beforeEach(() => {
    app = new App();
    listener = jest.fn();
});

test('app getters should not be null after its construction', () => {
    expect(app.onServerStarted).not.toBeNull();
    expect(app.onPlayersCountUpdated).not.toBeNull();
    expect(app.onDebugModeToggled).not.toBeNull();
    expect(app.onPlayerConnected).not.toBeNull();
});

test('addListener() called without the second parameter should call the listener more than once, when the event is dispatched more than once', () => {
    app.onServerStarted.addListener(listener);
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    expect(listener).toBeCalledTimes(3);
});

test('addListener() called with the second parameter set to "false" should call the listener more than once, when the event is dispatched more than once', () => {
    app.onServerStarted.addListener(listener, false);
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    expect(listener).toBeCalledTimes(3);
});

test('addListener() called with the second parameter set to "true" should call the listener only once, when the event is dispatched more than once', () => {
    app.onServerStarted.addListener(listener, true);
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    expect(listener).toBeCalledTimes(1);
});

test("removeListener() should remove the listener, so next time the event is dispatched, it won't call the listener", () => {
    app.onServerStarted.addListener(listener);
    app.dispatchServerStarted();
    app.dispatchServerStarted();
    app.onServerStarted.removeListener(listener);
    app.dispatchServerStarted();
    expect(listener).toBeCalledTimes(2);
});

test("removeListener() should be executed with no problem if listener wasn't find in the list of current registered listeners", () => {
    expect(() => {
        app.onServerStarted.removeListener(listener);
    }).not.toThrowError();
});

test("typed event getter should have methods to add and remove listeners", () => {
    expect(app.onServerStarted).toHaveProperty('addListener');
    expect(app.onServerStarted).toHaveProperty('removeListener');
});

test("typed event getter should not have the dispatch method", () => {
    expect(app.onServerStarted).not.toHaveProperty('dispatch');
});

test("should pass 'undefined' to the listener when the event dispatches no parameters", () => {
    app.onServerStarted.addListener(listener);
    app.dispatchServerStarted();
    expect(listener.mock.calls).toEqual([[undefined]]);
});

test("should pass the correct parameters to the listener when the event dispatches a boolean", () => {
    app.onDebugModeToggled.addListener(listener);
    app.dispatchDebugModeToggled();
    expect(listener.mock.calls).toEqual([[true]]);
});

test("should pass the correct parameters to the listener when the event dispatches a number", () => {
    app.onPlayersCountUpdated.addListener(listener);
    app.dispatchPlayersCountUpdated();
    expect(listener.mock.calls).toEqual([[32]]);
});

test("should pass the correct parameters to the listener when the event dispatches a cutom type", () => {
    app.onPlayerConnected.addListener(listener);
    app.dispatchPlayerConnected();
    expect(listener.mock.calls).toEqual([[{name: "TS", level: 7, isAlive: true}]]);
});
