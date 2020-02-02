# Typed Event Dispatcher

[![npm version](https://img.shields.io/npm/v/typed-event-dispatcher.svg?style=flat)](https://www.npmjs.org/package/typed-event-dispatcher)
[![npm downloads](https://img.shields.io/npm/dm/typed-event-dispatcher.svg?style=flat)](http://npm-stat.com/charts.html?package=typed-event-dispatcher)
[![Build Status](https://img.shields.io/github/workflow/status/felladrin/typed-event-dispatcher/Build%20and%20Test)](https://github.com/felladrin/typed-event-dispatcher/actions?query=workflow%3A%22Build+and+Test%22)
[![Coverage Status](https://coveralls.io/repos/github/felladrin/typed-event-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/felladrin/typed-event-dispatcher?branch=master)
[![David](https://img.shields.io/david/felladrin/typed-event-dispatcher)](https://david-dm.org/felladrin/typed-event-dispatcher)
[![install size](https://packagephobia.now.sh/badge?p=typed-event-dispatcher)](https://packagephobia.now.sh/result?p=typed-event-dispatcher)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/typed-event-dispatcher)](https://bundlephobia.com/result?p=typed-event-dispatcher)

A solution for strongly-typed events that can be publicly listened but internally-only dispatched by using getters.

Made for Typescript ([See Live Example](https://repl.it/@victornogueira/typed-event-dispatcher-typescript-example)) and JavaScript ([See Live Example](https://repl.it/@victornogueira/typed-event-dispatcher-javascript-example)) codebases. Works on Node.js and the browsers.

## Getting Started

```shell script
npm install typed-event-dispatcher
```

```typescript
import { TypedEventDispatcher } from "typed-event-dispatcher";

class Counter {
  // STEP 1: Create a private event dispatcher.
  private onCountIncreasedDispatcher = new TypedEventDispatcher<number>();

  // STEP 2: Create a public event getter.
  public get onCountIncreased() {
    return this.onCountIncreasedDispatcher.getter;
  }

  public increaseCountOncePerSecond() {
    setInterval(() => {
      this.increaseCount();

      // STEP 3: Dispatch the event so listeners can react to it.
      this.onCountIncreasedDispatcher.dispatch(this.count);
    }, 1000);
  }

  private count = 0;

  private increaseCount() {
    this.count++;
  }
}

class Example {
  private counter = new Counter();

  public start() {
    console.log("Starting count...");

    // STEP 4: Listen to events dispatched by other classes.
    this.counter.onCountIncreased.addListener(count => {
      console.log(`Count increased to ${count}.`);
    });

    this.counter.increaseCountOncePerSecond();
  }
}

new Example().start();
```

## Usage Overview

Define private event dispatchers on your class, with or without data-passthroughs, like this:

```typescript
class ServerExample {
  // Passing no data, just informing the event happened:
  private onStartedDispatcher = new TypedEventDispatcher();

  // Passing a number along with the event:
  private onPlayersCountUpdatedDispatcher = new TypedEventDispatcher<number>();

  // Passing a boolean:
  private onDebugModeToggledDispatcher = new TypedEventDispatcher<boolean>();
}
```

If you need to pass several data with your event, define a custom data type:

```typescript
type Player = {
  name: string;
  level: number;
  isAlive: boolean;
};

class ServerExample {
  // Passing the complete player info along with the event:
  private onPlayerConnectedDispatcher = new TypedEventDispatcher<Player>();
}
```

Then, on the same class, create public getters for your events,
by returning the `getter` property from a dispatcher.  
The getters expose only two methods: `addListener()` and `removeListener()`.  
And you don't need to declare the return type of the getters,
as TypeScript resolves it automatically.

```typescript
class ServerExample {
  public get onStarted() {
    return this.onStartedDispatcher.getter;
  }

  public get onPlayersCountUpdated() {
    return this.onPlayersCountUpdatedDispatcher.getter;
  }

  public get onDebugModeToggled() {
    return this.onDebugModeToggledDispatcher.getter;
  }

  public get onPlayerConnected() {
    return this.onPlayerConnectedDispatcher.getter;
  }
}
```

Finally, `dispatch()` the events when some action occurs!  
Usually we do it at the end of the class methods, so other
classes react after those actions.

```typescript
class ServerExample {
  private start() {
    // (...)
    this.onStartedDispatcher.dispatch();
  }

  private updateStats() {
    // (...)
    this.onPlayersCountUpdatedDispatcher.dispatch(32);
  }

  private toggleDebugMode() {
    // (...)
    this.onDebugModeToggledDispatcher.dispatch(true);
  }

  private registerPlayer(player: Player) {
    // (...)
    this.onPlayerConnectedDispatcher.dispatch(player);
  }
}
```

On other classes, start listening to those events.
The callback parameters are also auto-resolved by TypeScript,
based on the type of the event. So you don't need to declare them.

```typescript
class AppExample {
  // A private variable holding an instance of the other class that dispatchers events:
  private server: ServerExample;

  public registerListeners() {
    // The event 'onStarted' passes no data, so the listener has no arguments:
    this.server.onStarted.addListener(() => console.log("Server started!"));

    // But 'onPlayersCountUpdated' passes a number, so the listener has one argument to hold it:
    this.server.onPlayersCountUpdated.addListener(playersCount => {
      spawnEnemiesBasedOnPlayersCount(playersCount);
      if (playersCount > playersCountRecord) {
        registerNewPlayersCountRecord(playersCount);
      }
    });

    // And the listener for 'onDebugModeToggled' also has an argument, holding the boolean passed:
    this.server.onDebugModeToggled.addListener(isDebugModeActive => {
      debug(`Debug Mode set to ${isDebugModeActive}.`);
      if (isDebugModeActive) {
        debug("Messages using debug() will now be displayed on console.");
      }
    });

    // Same story for 'onPlayerConnected', which passes the player info:
    this.server.onPlayerConnected.addListener(player => {
      addToGlobalChat(player);
      createCustomQuests(player);
      prepareRandomEncounters(player);
    });
  }
}
```

## License

The MIT License  
<http://victor.mit-license.org>
