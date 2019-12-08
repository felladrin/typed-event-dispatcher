# Typed Event Dispatcher

A solution for strongly-typed events that can be publicly listened but internally-only dispatched.

## Installation

```shell script
$ npm install typed-event-dispatcher
```

## Import

```javascript
const { TypedEventDispatcher } = require('typed-event-dispatcher');
```

```typescript
import { TypedEventDispatcher } from "typed-event-dispatcher";
```

## Usage

```typescript
export class CountDownTimer {
  public get onCountDownStarted() { return this.onCountDownStartedDispatcher.getter; }
  public get onCountDownUpdated() { return this.onCountDownUpdatedDispatcher.getter; }

  private onCountDownStartedDispatcher = new TypedEventDispatcher();
  private onCountDownUpdatedDispatcher = new TypedEventDispatcher<number>();

  private count = 0;

  public addBonusTime(bonus: number): void {
    this.count += bonus;
    this.onCountDownUpdatedDispatcher.dispatch(this.count);
  }

  public deductTime(deduction: number): void {
    this.count -= deduction;
    this.onCountDownUpdatedDispatcher.dispatch(this.count);
  }

  public start(initialCount: number): void {
    this.count = initialCount;
    this.onCountDownStartedDispatcher.dispatch();
  }
}
```

```typescript
class Main {
    private countDownTimer: CountDownTimer;

    constructor() {
        this.countDownTimer = new CountDownTimer();
        this.countDownTimer.onCountDownStarted.addListener(this.handleCountDownStarted, true);
        this.countDownTimer.onCountDownUpdated.addListener(this.handleCountDownUpdated);
        this.countDownTimer.start(10);
    }
    
    private handleCountDownStarted() {
        console.log("Count down started!");
        console.log("Listener removed automatically!");
    }
    
    private handleCountDownUpdated(count: number) {
        console.log(`Count down updated to ${count}!`);
        if (count == 0) {
            this.countDownTimer.onCountDownUpdated.removeListener(this.handleCountDownUpdated);  
            console.log("Listener removed manually!");      
        }
    }
}
```

## License

The MIT License  
<http://victor.mit-license.org>
