import { sendRequest } from "./request.js";
import { printSummary, record } from "./metrics.js";
async function startTesting({ url, duration, concurrency, method, body}) {
    const endTime = Date.now() + duration * 1000;
    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(
            (async () => {
                while (Date.now() < endTime) {
                    record(await sendRequest({ url, method, body }));
                }
            })()
        );
    }

    await Promise.all(workers);

    printSummary(duration);
}

export { startTesting };