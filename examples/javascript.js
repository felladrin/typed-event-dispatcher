import { TypedEventDispatcher } from "typed-event-dispatcher";

class Counter {
  constructor() {
    this.count = 0;

    //--------------------------------------------//
    // STEP 1: Create a private event dispatcher. //
    //--------------------------------------------//
    this.onCountIncreasedDispatcher = new TypedEventDispatcher(this.count);
  }

  //---------------------------------------//
  // STEP 2: Create a public event getter. //
  //---------------------------------------//
  get onCountIncreased() {
    return this.onCountIncreasedDispatcher.getter;
  }

  increaseCountOncePerSecond() {
    setInterval(() => {
      this.increaseCount();

      //----------------------------------------------------------//
      // STEP 3: Dispatch the event so listeners can react to it. //
      //----------------------------------------------------------//
      this.onCountIncreasedDispatcher.dispatch(this.count);
    }, 1000);
  }

  increaseCount() {
    this.count++;
  }
}

class Example {
  constructor() {
    this.counter = new Counter();
  }

  start() {
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
