// lib/utils/consoleLog.ts
function consoleLog(log) {
  if (LOG_LEVEL == "verbose") {
    console.log(log);
  }
}
var LOG_LEVEL = process.env.LOG_LEVEL || "info";

// lib/utils/generateRandomString.ts
function generateRandomString(length) {
  if (length < 3) {
    length = 3;
  }
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0;i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// lib/pool.ts
function addEventToPool(thePromise, callbacks) {
  if (pool.length > POOL_SIZE) {
    throw new Error("Max pool size reached");
  }
  const eventToProcess = {
    id: generateRandomString(10),
    promise: thePromise
  };
  let resolvedEvent;
  thePromise.then((payload) => {
    if (callbacks && callbacks.then) {
      callbacks.then(payload, eventToProcess);
    }
    resolvedEvent = payload;
    consoleLog(`Event with id: ${eventToProcess.id} completed successfully.`);
  }).catch((err) => {
    if (callbacks && callbacks.catch) {
      callbacks.catch(err, eventToProcess);
    }
    consoleLog(`Event with id: ${eventToProcess.id} failed to complete.`);
  }).finally(() => {
    const index = pool.indexOf(eventToProcess);
    if (index > -1) {
      pool.splice(index, 1);
    }
    if (callbacks && callbacks.finally) {
      callbacks.finally();
    }
    consoleLog(`Slot freed for event id: ${eventToProcess.id}`);
    if (onOpenSlotCallback) {
      onOpenSlotCallback(resolvedEvent);
    }
  });
  pool.push(eventToProcess);
  return eventToProcess;
}
function onOpenSlot(cb) {
  if (onOpenSlotCallback) {
    throw new Error("Only one 'on open slot' callback can be set.");
  }
  onOpenSlotCallback = cb;
}
function getOpenSlotCount() {
  return POOL_SIZE - pool.length;
}
var POOL_SIZE = parseInt(process.env.POOL_SIZE) || 10;
if (!POOL_SIZE || POOL_SIZE < 1) {
  console.error(`Missing or invalid environment variable: POOL_SIZE should be a positive integer.`);
  process.exit(1);
}
var pool = [];
var onOpenSlotCallback;
export {
  onOpenSlot,
  getOpenSlotCount,
  addEventToPool,
  POOL_SIZE
};
