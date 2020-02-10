# Typed Event Dispatcher

[![NPM Version](https://img.shields.io/npm/v/typed-event-dispatcher.svg?style=flat)](https://www.npmjs.org/package/typed-event-dispatcher)
[![Build Status](https://img.shields.io/github/workflow/status/felladrin/typed-event-dispatcher/Build%20and%20Test)](https://github.com/felladrin/typed-event-dispatcher/actions?query=workflow%3A%22Build+and+Test%22)
[![Coverage Status](https://img.shields.io/coveralls/github/felladrin/typed-event-dispatcher)](https://coveralls.io/github/felladrin/typed-event-dispatcher?branch=master)
[![Dependencies](https://img.shields.io/david/felladrin/typed-event-dispatcher)](https://david-dm.org/felladrin/typed-event-dispatcher)
[![GitHub](https://img.shields.io/github/license/felladrin/typed-event-dispatcher)](http://victor.mit-license.org/)
[![Minified + Gzipped Size](https://img.shields.io/bundlephobia/minzip/typed-event-dispatcher)](https://bundlephobia.com/result?p=typed-event-dispatcher)

A solution for strongly-typed events that can be publicly listened but internally-only dispatched.

Made for Typescript ([See Live Example](https://repl.it/@victornogueira/typed-event-dispatcher-typescript-example)) and JavaScript ([See Live Example](https://repl.it/@victornogueira/typed-event-dispatcher-javascript-example)) codebases.

Works on Node.js and Browsers.

## Getting Started

```sh
npm install typed-event-dispatcher
```

```js
// OPTION 1: Import as an ES Module, for JS/TS projects.
import { TypedEventDispatcher } from "typed-event-dispatcher";

// OPTION 2: Require as a CommonJS Module, for JS projects.
const { TypedEventDispatcher } = require("typed-event-dispatcher");

// OPTION 3: Import as a TypeScript Module, for TS projects.
import { TypedEventDispatcher } from "typed-event-dispatcher/ts";
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
    this.counter.onCountIncreased.addListener(count => {
      console.log(`Count increased to ${count}.`);
    });

    this.counter.increaseCountOncePerSecond();
  }
}

new Example().start();
```

## API Reference

### `TypedEventDispatcher<T>`

---

```ts
dispatch(data?: T): void;
```

> Dispatches the event, optionally passing some data.

---

```ts
get getter(): TypedEvent<T>;
```

> Returns the TypedEvent, see below.

---

### `TypedEvent<T>`

---

```ts
addListener(listener: TypedEventListener<T>, listenOnlyOnce?: boolean): void;
```

> Adds a listener to the event, optionally setting it to listen only once. (`listenOnlyOnce` is `false` by default)

---

```ts
removeListener(listener: TypedEventListener<T>): void;
```

> Removes a listener, passed by reference.

---

```ts
type TypedEventListener<T> = (data?: T) => void;
```

> A type definition representing a void function with optional parameter dynamically-typed.

---

## Usage Overview

Define private event dispatchers on your class, with or without data-passthroughs, like this:

```ts
class ServerExample
{
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

class ServerExample
{
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
class AppExample
{
  //-------------------------------//
  // A private variable holding an //
  // instance of the other class.  //
  //-------------------------------//
  private server: ServerExample;

  public registerListeners()
  {
    //---------------------------------------//
    // The event 'onStarted' passes no data, //
    // so the listener has no arguments.     //
    //---------------------------------------//
    this.server.onStarted.addListener(() => {
      console.log("Server started!")
    });

    //----------------------------------------------//
    // But 'onPlayersCountUpdated' passes a number, //
    // so the listener has one argument to hold it. //
    //----------------------------------------------//
    this.server.onPlayersCountUpdated.addListener(playersCount => {
      spawnEnemiesBasedOnPlayersCount(playersCount);

      if (playersCount > playersCountRecord) {
        registerNewPlayersCountRecord(playersCount);
      }
    });

    //------------------------------------------------//
    // And the listener for 'onDebugModeToggled' also //
    // has an argument, holding the boolean passed.   //
    //------------------------------------------------//
    this.server.onDebugModeToggled.addListener(isDebugModeActive => {
      debug(`Debug Mode set to ${isDebugModeActive}.`);

      if (isDebugModeActive) {
        debug("Messages using debug() will now be displayed on console.");
      }
    });

    //-------------------------------------//
    // Same story for 'onPlayerConnected', //
    // which passes the player info.       //
    //-------------------------------------//
    this.server.onPlayerConnected.addListener(player => {
      addToGlobalChat(player);
      createCustomQuests(player);
      prepareRandomEncounters(player);
    });
  }
}
```
