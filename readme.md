# Typed Event Dispatcher

[![NPM Version](https://img.shields.io/npm/v/typed-event-dispatcher.svg?style=flat)](https://www.npmjs.org/package/typed-event-dispatcher)
[![Build Status](https://img.shields.io/github/workflow/status/felladrin/typed-event-dispatcher/Build%20and%20Test)](https://github.com/felladrin/typed-event-dispatcher/actions?query=workflow%3A%22Build+and+Test%22)
[![Coverage Status](https://coveralls.io/repos/github/felladrin/typed-event-dispatcher/badge.svg?branch=master)](https://coveralls.io/github/felladrin/typed-event-dispatcher?branch=master)
[![License](https://img.shields.io/github/license/felladrin/typed-event-dispatcher)](http://victor.mit-license.org/)

Strongly-typed events that can be publicly listened but internally-only dispatched.

A [lightweight](https://bundlephobia.com/result?p=typed-event-dispatcher), [fully-tested](https://coveralls.io/github/felladrin/typed-event-dispatcher) and [dependency-free](https://www.npmjs.com/package/typed-event-dispatcher) lib made for Typescript ([see live example](https://repl.it/@victornogueira/typed-event-dispatcher-typescript-example)) and JavaScript ([see live example](https://repl.it/@victornogueira/typed-event-dispatcher-javascript-example)) codebases.

## Getting Started

```sh
npm install typed-event-dispatcher
```

```ts
// Import as an ES Module.
import { TypedEventDispatcher } from "typed-event-dispatcher";
```

```js
// Or require as a CommonJS Module.
const { TypedEventDispatcher } = require("typed-event-dispatcher");
```

```ts
// Or import it from URL.
import { TypedEventDispatcher } from "https://esm.sh/typed-event-dispatcher";
```

```html
<!-- Or use it directly in the browser. -->
<script src="https://unpkg.com/typed-event-dispatcher"></script>
<script>
  const { TypedEventDispatcher } = window["typed-event-dispatcher"];
</script>
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

## Further Reading

For more details about how to use this lib, please refer to the [Usage Overview](./readme-too.md).

Check also the [Online Documentation](https://felladrin.github.io/typed-event-dispatcher/index.html). Or generate it locally by running `npm run docs`.

Although all you need to know is only two definitions:

- [`TypedEventDispatcher<T>`](https://felladrin.github.io/typed-event-dispatcher/classes/_typed_event_dispatcher_.typedeventdispatcher.html)
- [`TypedEvent<T>`](https://felladrin.github.io/typed-event-dispatcher/modules/_typed_event_dispatcher_.html#typedevent)
