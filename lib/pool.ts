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
