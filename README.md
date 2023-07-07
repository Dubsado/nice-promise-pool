# async-pool

## Usage

`yarn add promise-pool`

```
import { addEventToPool, onOpenSlot, getOpenSlotCount } from "nice-promise-pool";
import { queryEventDatabase } from "./utils/mockApi";

const INTERVAL_TIME = 1000;

// in the case where we loop back outside of the interval loop or for some reason
// the loop function takes longer than the interval time, we need to make sure
// the event loop doesn't bubble up on top of itself
let loopLock = false;

const onSuccessfulEvent = (payload: any, eventProcessed: EventToProcess) => {
  console.log(`successfully ran ${eventProcessed.id}`);
};

const onFailedEvent = (error: unknown, eventProcessed: EventToProcess) => {
  console.error(`failed to run ${eventProcessed.id}`);
  console.error(error);
};

/**
 * Runs the batch work. Will not allow itself to be called more than once at a time.
 * @returns
 */
async function loop() {
  if (loopLock) {
    console.log(`loop is already processing`);
    return;
  }
  loopLock = true;
  const openSlots: number = getOpenSlotCount();
  // this is going to return a number of promises per the available amount of slots
  const promises: Promise<any>[] = queryEventDatabase(openSlots);
  if (promises.length === 0) console.log(`nothing found in this loop`);
  for (const promise of promises) {
    const eventToProcess = addEventToPool(promise, {
      then: onSuccessfulEvent,
      catch: onFailedEvent,
    });
    console.log(`added ${eventToProcess.id} to be processed`);
  }
  loopLock = false;
}

// by calling loop first we don't have to wait one second upon boot
loop().then(() => {
  onOpenSlot(() => {
    loop();
  });
  setInterval(loop, INTERVAL_TIME);
});
```

# Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v0.5.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
