import { TypedEventDispatcher } from "typed-event-dispatcher";

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