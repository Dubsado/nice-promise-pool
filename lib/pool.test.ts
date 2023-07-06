import { expect, test, describe } from "bun:test";
import { POOL_SIZE, addEventToPool, getOpenSlotCount, onOpenSlot } from "./pool";
import { generatePromise } from "./utils/generatePromise";

describe("Testing events in pool", () => {
  // Test case to verify that all events complete execution
  test("All randomly timed events eventually finish", async (done) => {
    // Add events equal to pool size to ensure it's filled up
    for (let i = 0; i <= POOL_SIZE; i++) {
      addEventToPool(generatePromise());
    }
    // Allow some time for events to complete and then check if the pool size is back to its original value
    setTimeout(() => {
      expect(getOpenSlotCount()).toEqual(POOL_SIZE);
      done();
    }, 300);
  });

  // Test case to verify that once an event is completed, new events can be added to the pool
  test("Once the maxed out queue has an opening, events can be added", async (done) => {
    let addedOneMore = false;

    // Define a callback to be invoked when a slot becomes available in the pool
    onOpenSlot(() => {
      if (addedOneMore) {
        return;
      }
      addedOneMore = true;
      // Add an additional event to the pool and check if it executes properly
      addEventToPool(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
            expect(addedOneMore).toBeTruthy();
            done();
          }, 200);
        })
      );
    });
    // Initially fill the pool to its max size
    for (let i = 0; i <= POOL_SIZE; i++) {
      addEventToPool(generatePromise());
    }
  });

  // Test case to verify that adding more events than the pool size leads to an error
  test("Adding more threads than POOL_SIZE causes an error", async () => {
    expect(() => {
      for (let i = 0; i <= POOL_SIZE + 1; i++) {
        addEventToPool(generatePromise());
      }
    }).toThrow();
  });
});
