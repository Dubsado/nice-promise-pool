type PromiseToProcess = Promise;
type PromisesToProcess = PormiseToProcess<any>[];
type EventToProcess = { id: string; promise: PromiseToProcess };
