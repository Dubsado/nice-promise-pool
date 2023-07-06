import { expect, test, describe, beforeAll } from 'bun:test'

describe('Run events in pool', () => {
    // leaving this here in case we have
    // any globals we'd like to set
    beforeAll(async () => {})

    // running a simple test to make sure
    // after all events complete there's
    // some kind of finished state
    test('All randomly timed events eventually finish', async () => {})

    // a more complicated test now to make
    // sure that we can react when the pool
    // size drops below the max pool size
    // that we can pop in more events to process
    // and eventually come back to completion
    test('All randomly timed events eventually finish', async () => {})
})
