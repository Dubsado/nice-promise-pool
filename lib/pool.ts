// get pool size declared
const POOL_SIZE = parseInt(process.env.POOL_SIZE as string) || 10
if (!POOL_SIZE || POOL_SIZE < 1) {
    console.error(`Mising environment variable POOL_SIZE`)
    process.exit(1)
}
// in memory instance of all pooled connections
const pool: Event[] = []

/**
 * Unsafely adds an Event into the global pool
 * @param event
 */
export function addEventToPool(event: Event) {
    if (pool.length > POOL_SIZE) {
        throw new Error('Max pool size reached')
    }
    pool.push(event)
}

const processInPool = async (events, poolSize) => {
    let pool = {}

    for (const event in events) {
        try {
            pool[event] = sendEmail(event)
            pool[event].finally(
                // When promise resolves remove it from stored array of promises
                (events = events.filter((filterItem) => {
                    return filterItem !== pool[event]
                }))
            )
            console.log('event: ', event)
            console.log('pool event: ', pool[event])
            if (Object.keys(pool).length > poolSize - 1) {
                const promises = Object.values(pool)
                await Promise.race(promises) // wait for one Promise to finish
            }
        } catch (err) {
            console.log(`error with ${event}: ${err}`)
            console.log(err)
        }
    }

    await Promise.all(Object.values(pool))
}
