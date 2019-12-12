# Typed Event Dispatcher

A solution for strongly-typed events that can be publicly listened but internally-only dispatched by using getters.

## Installation

```shell script
$ npm install typed-event-dispatcher
```

## Usage Overview

Define private events on your class, with or without data-passthroughs:

```typescript
private onServerStartedDispatcher = new TypedEventDispatcher();
private onPlayersCountUpdatedDispatcher = new TypedEventDispatcher<number>();
private onDebugModeToggledDispatcher = new TypedEventDispatcher<boolean>();
```

If you need to pass several data with your event, define a custom data type:

```typescript
type Player = {
    name: string;
    level: number;
    isAlive: boolean;
};
private onPlayerConnectedDispatcher = new TypedEventDispatcher<Player>();
```

Then create public getters for your events, so you'll expose only the `addListener()` and `removeListener()` methods.
You don't need to declare the return type of the getters, as TypeScript resolves it automatically.

```typescript
public get onServerStarted() { return this.onServerStartedDispatcher.getter; }
public get onPlayersCountUpdated() { return this.onPlayersCountUpdatedDispatcher.getter; }
public get onDebugModeToggled() { return this.onDebugModeToggledDispatcher.getter; }
public get onPlayerConnected() { return this.onPlayerConnectedDispatcher.getter; }
```

On other classes, start listening to those events.
The callback parameters are also auto-resolved by TypeScript,
based on the type of the event. So you don't need to declare them.

```typescript
this.server.onServerStarted.addListener(() => console.log("Server started!"));

this.server.onPlayersCountUpdated.addListener(playersCount => {
    spawnEnemiesBasedOnPlayersCount(playersCount);
    if (playersCount > playersCountRecord) {
        registerNewPlayersCountRecord(playersCount);
    }
});

this.server.onDebugModeToggled.addListener(isDebugModeActive => {
    debug(`Debug Mode set to ${isDebugModeActive}.`);
    if (isDebugModeActive) {
        debug("Messages using debug(<message>) will now be displayed on console.");
    }
});

this.server.onPlayerConnected.addListener(player => {
    addToGlobalChat(player);
    createCustomQuests(player);
    prepareRandomEncounters(player);
});
```

Now, whenever it's time, `dispatch()` the events!

```typescript
this.onServerStartedDispatcher.dispatch();
this.onPlayersCountUpdatedDispatcher.dispatch(32);
this.onDebugModeToggledDispatcher.dispatch(true);
this.onPlayerConnectedDispatcher.dispatch({name: "TS", level: "7", isAlive: true});
```

## Quick Example (TypeScript)

```typescript
import { TypedEventDispatcher } from "typed-event-dispatcher";

class Counter {
    private count = 0;
    private onCountUpdatedDispatcher = new TypedEventDispatcher<number>();

    public get onCountUpdated() {
        return this.onCountUpdatedDispatcher.getter;
    }

    public start() {
        setInterval(() => {    
            this.onCountUpdatedDispatcher.dispatch(++this.count);
        }, 1000);
    }
}

class App {
    private counter = new Counter();

    public start() {
        this.counter.onCountUpdated.addListener((count) => {
            console.log(`Count updated to ${count}`);
        });
        this.counter.start();
    }
}

new App().start();
```

## Quick Example (JavaScript)

You can paste this one on [RunKit](https://npm.runkit.com/typed-event-dispatcher) to see it in action!

```javascript
const { TypedEventDispatcher } = require("typed-event-dispatcher")

class Counter {
    constructor() {
        this.count = 0;
        this.onCountUpdatedDispatcher = new TypedEventDispatcher();
    }
    
    get onCountUpdated() {
        return this.onCountUpdatedDispatcher.getter;
    }
    
    start() {
        setInterval(() => {
            this.onCountUpdatedDispatcher.dispatch(++this.count);
        }, 1000);
    }
}

class App {
    constructor() {
        this.counter = new Counter();
    }
    
    start() {
        this.counter.onCountUpdated.addListener((count) => {
            console.log(`Count updated to ${count}`);
        });
        this.counter.start();
    }
}

new App().start();
```

## License

The MIT License  
<http://victor.mit-license.org>
