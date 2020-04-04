# Typed Event Dispatcher

[![NPM Version](https://img.shields.io/npm/v/typed-event-dispatcher.svg?style=flat)](https://www.npmjs.org/package/typed-event-dispatcher)
[![Build Status](https://img.shields.io/github/workflow/status/felladrin/typed-event-dispatcher/Build%20and%20Test)](https://github.com/felladrin/typed-event-dispatcher/actions?query=workflow%3A%22Build+and+Test%22)
[![Coverage Status](https://coveralls.io/repos/github/felladrin/typed-event-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/felladrin/typed-event-dispatcher?branch=master)
[![GitHub](https://img.shields.io/github/license/felladrin/typed-event-dispatcher)](http://victor.mit-license.org/)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/felladrin/typed-event-dispatcher)

Strongly-typed events that can be publicly listened but internally-only dispatched.

A [lightweight](https://bundlephobia.com/result?p=typed-event-dispatcher), [fully-tested](https://coveralls.io/github/felladrin/typed-event-dispatcher) and [dependency-free](https://www.npmjs.com/package/typed-event-dispatcher) lib made for Typescript ([see live example](https://repl.it/@victornogueira/typed-event-dispatcher-typescript-example)) and JavaScript ([see live example](https://repl.it/@victornogueira/typed-event-dispatcher-javascript-example)) codebases.

## Getting Started

```sh
npm install typed-event-dispatcher
```

```js
// Import as an ES Module.
import { TypedEventDispatcher } from "typed-event-dispatcher";

// Or require as a CommonJS Module.
const { TypedEventDispatcher } = require("typed-event-dispatcher");
```

```ts
class Counter {
  //--------------------------------------------//
  // STEP 1: Create a private event dispatcher. //
  //--------------------------------------------//
  private onCountIncreasedDispatcher = new TypedEventDispatcher<number>();

  //---------------------------------------//
  // STEP 2: Create a public event getter. //
  //---------------------------------------//
  public get onCountIncreased() {
    return this.onCountIncreasedDispatcher.getter;
  }

  public increaseCountOncePerSecond() {
    setInterval(() => {
      this.increaseCount();

      //----------------------------------------------------------//
      // STEP 3: Dispatch the event so listeners can react to it. //
      //----------------------------------------------------------//
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

    //-------------------------------------------------------//
    // STEP 4: Listen to events dispatched by other classes. //
    //-------------------------------------------------------//
    this.counter.onCountIncreased.addListener((count) => {
      console.log(`Count increased to ${count}.`);
    });

    this.counter.increaseCountOncePerSecond();
  }
}

new Example().start();
```

## API Reference

You can find the latest documentation [here](https://www.victornogueira.app/typed-event-dispatcher/), or generate it locally using `npm run docs`.

Although all you need to know is only two definitions:

- [`TypedEventDispatcher<T>`](https://www.victornogueira.app/typed-event-dispatcher/classes/_typed_event_dispatcher_.typedeventdispatcher.html)
- [`TypedEvent<T>`](https://www.victornogueira.app/typed-event-dispatcher/modules/_typed_event_dispatcher_.html#typedevent)

## Usage Overview

Define private event dispatchers on your class, with or without data-passthroughs, like this:

```ts
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

```ts
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

```ts
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

```ts
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

```ts
class AppExample {
  //-------------------------------//
  // A private variable holding an //
  // instance of the other class.  //
  //-------------------------------//
  private server: ServerExample;

  public registerListeners() {
    //---------------------------------------//
    // The event 'onStarted' passes no data, //
    // so the listener has no arguments.     //
    //---------------------------------------//
    this.server.onStarted.addListener(() => {
      console.log("Server started!");
    });

    //----------------------------------------------//
    // But 'onPlayersCountUpdated' passes a number, //
    // so the listener has one argument to hold it. //
    //----------------------------------------------//
    this.server.onPlayersCountUpdated.addListener((playersCount) => {
      spawnEnemiesBasedOnPlayersCount(playersCount);

      if (playersCount > playersCountRecord) {
        registerNewPlayersCountRecord(playersCount);
      }
    });

    //------------------------------------------------//
    // And the listener for 'onDebugModeToggled' also //
    // has an argument, holding the boolean passed.   //
    //------------------------------------------------//
    this.server.onDebugModeToggled.addListener((isDebugModeActive) => {
      debug(`Debug Mode set to ${isDebugModeActive}.`);

      if (isDebugModeActive) {
        debug("Messages using debug() will now be displayed on console.");
      }
    });

    //-------------------------------------//
    // Same story for 'onPlayerConnected', //
    // which passes the player info.       //
    //-------------------------------------//
    this.server.onPlayerConnected.addListener((player) => {
      addToGlobalChat(player);
      createCustomQuests(player);
      prepareRandomEncounters(player);
    });
  }
}
```
