import { consoleLog } from "./utils/consoleLog";
import { generateRandomString } from "./utils/generateRandomString";

// Fetches pool size from environment variables, default to 10 if not provided
export const POOL_SIZE = parseInt(process.env.POOL_SIZE as string) || 10;
if (!POOL_SIZE || POOL_SIZE < 1) {
  console.error(`Missing or invalid environment variable: POOL_SIZE should be a positive integer.`);
  process.exit(1);
}

// An in-memory queue that maintains all connections
const pool: EventToProcess[] = [];
let onOpenSlotCallback: any;

type Callbacks = {
  then: (payload: any, eventToProcess: EventToProcess) => void;
  catch: (err: unknown, eventToProcess: EventToProcess) => void;
  finally: () => void;
};

/**
 * Function to add a new Event to the global pool. Throws error if pool size limit is reached.
 * @param thePromise - The Promise object that represents the event to be processed
 * @param callbacks - Optional callback functions to handle Promise's then, catch, and finally events
 */
export function addEventToPool(thePromise: PromiseToProcess, callbacks?: Callbacks) {
  if (pool.length > POOL_SIZE) {
    throw new Error("Max pool size reached");
  }
  const eventToProcess: EventToProcess = {
    id: generateRandomString(10),
    promise: thePromise,
  };

  // Attach Promise's event handlers
  thePromise.then((payload: any) => {
    callbacks?.then(payload, eventToProcess);
    consoleLog(`Event with id: ${eventToProcess.id} completed successfully.`);
  });
  thePromise.catch((err: unknown) => {
    callbacks?.catch(err, eventToProcess);
    consoleLog(`Event with id: ${eventToProcess.id} failed to complete.`);
  });
  thePromise.finally(() => {
    // Remove the completed/failed item from the pool
    const index = pool.indexOf(eventToProcess);
    if (index > -1) {
      pool.splice(index, 1);
    }

    callbacks?.finally();
    consoleLog(`Slot freed for event id: ${eventToProcess.id}`);
    // Callback to notify when there's an available slot in the pool
    if (onOpenSlotCallback) {
      onOpenSlotCallback();
    }
  });

  // Add the newly created event object to the pool
  pool.push(eventToProcess);
}

/**
 * Function to set a callback that will be invoked when a slot becomes available in the pool
 * @param cb - The callback function to set
 */
export function onOpenSlot(cb: () => void) {
  if (onOpenSlotCallback) {
    throw new Error("Only one 'on open slot' callback can be set.");
  }
  onOpenSlotCallback = cb;
}

/**
 * Function to get the number of currently available slots in the pool
 * @returns The number of available slots
 */
export function getOpenSlotCount(): number {
  return POOL_SIZE - pool.length;
}
