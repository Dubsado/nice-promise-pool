//ahh brain dump

const doWork = async (email) => {
    return new Promise((resolve, reject) => {
        if (email % 2 === 0) {
            setTimeout(() => {
                console.log(email)
            }, 1000)
        } else {
            setTimeout(() => {
                console.log(email)
            }, 500)
        }
    })
}

const getEvents = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}
const events = getEvents()
processInPool(events, 5)

return setTimeout(
    processIteration.bind(this, promisePool),
    Number(process.env.GMAIL_WORKER_RESET_TIME) || 5000
)
