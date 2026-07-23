# Typed Event Dispatcher

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
