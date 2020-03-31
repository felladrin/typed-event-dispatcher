import { TypedEventDispatcher, TypedEvent } from "./typed-event-dispatcher";

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

  public get onServerStarted(): TypedEvent<void> {
    return this.onServerStartedDispatcher.getter;
  }

  public get onPlayersCountUpdated(): TypedEvent<number> {
    return this.onPlayersCountUpdatedDispatcher.getter;
  }

  public get onDebugModeToggled(): TypedEvent<boolean> {
    return this.onDebugModeToggledDispatcher.getter;
  }

  public get onPlayerConnected(): TypedEvent<Player> {
    return this.onPlayerConnectedDispatcher.getter;
  }

  public dispatchServerStarted(): void {
    this.onServerStartedDispatcher.dispatch();
  }

  public dispatchPlayersCountUpdated(): void {
    this.onPlayersCountUpdatedDispatcher.dispatch(32);
  }

  public dispatchDebugModeToggled(): void {
    this.onDebugModeToggledDispatcher.dispatch(true);
  }

  public dispatchPlayerConnected(): void {
    this.onPlayerConnectedDispatcher.dispatch({
      name: "TS",
      level: 7,
      isAlive: true,
    });
  }
}

function pickRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function repeatFunction(fn: () => void, times: number): void {
  for (let i = 0; i < times; i++) fn();
}

let app: App;
let listener: jest.Mock;

beforeEach(() => {
  app = new App();
  listener = jest.fn();
});

test("app getters should not be null after app construction", () => {
  expect(app.onServerStarted).not.toBeNull();
  expect(app.onPlayersCountUpdated).not.toBeNull();
  expect(app.onDebugModeToggled).not.toBeNull();
  expect(app.onPlayerConnected).not.toBeNull();
});

test("addListener() called without the second parameter should call the listener more than once, when the event is dispatched more than once", () => {
  app.onServerStarted.addListener(listener);
  const times = pickRandomIntInclusive(2, 5);
  repeatFunction(() => {
    app.dispatchServerStarted();
  }, times);
  expect(listener).toBeCalledTimes(times);
});

test('addListener() called with the second parameter set to "false" should call the listener more than once, when the event is dispatched more than once', () => {
  app.onServerStarted.addListener(listener, false);
  const times = pickRandomIntInclusive(2, 5);
  repeatFunction(() => {
    app.dispatchServerStarted();
  }, times);
  expect(listener).toBeCalledTimes(times);
});

test('addListener() called with the second parameter set to "true" should call the listener only once, when the event is dispatched more than once', () => {
  app.onServerStarted.addListener(listener, true);
  const times = pickRandomIntInclusive(2, 5);
  repeatFunction(() => {
    app.dispatchServerStarted();
  }, times);
  expect(listener).toBeCalledTimes(1);
});

test("should ignore multiple additions of the same listener, so each unique listener can be added only once", () => {
  app.onServerStarted.addListener(listener);
  app.onServerStarted.addListener(listener);
  app.onServerStarted.addListener(listener);
  app.dispatchServerStarted();
  expect(listener).toBeCalledTimes(1);
});

test("removeListener() should remove the listener, so next time the event is dispatched, it won't call the listener", () => {
  app.onServerStarted.addListener(listener);
  const times = pickRandomIntInclusive(2, 5);
  repeatFunction(() => {
    app.dispatchServerStarted();
  }, times);
  app.onServerStarted.removeListener(listener);
  repeatFunction(() => {
    app.dispatchServerStarted();
  }, pickRandomIntInclusive(1, 5));
  expect(listener).toBeCalledTimes(times);
});

test("removeListener() should be executed with no problem if listener wasn't find in the list of current registered listeners", () => {
  expect(() => {
    app.onServerStarted.removeListener(listener);
  }).not.toThrowError();
});

test("typed event getter should have methods to add and remove listeners", () => {
  expect(app.onServerStarted).toHaveProperty("addListener");
  expect(app.onServerStarted).toHaveProperty("removeListener");
});

test("typed event getter should not have the dispatch method", () => {
  expect(app.onServerStarted).not.toHaveProperty("dispatch");
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

test("should pass the correct parameters to the listener when the event dispatches a custom type", () => {
  app.onPlayerConnected.addListener(listener);
  app.dispatchPlayerConnected();
  expect(listener.mock.calls).toEqual([
    [{ name: "TS", level: 7, isAlive: true }],
  ]);
});
