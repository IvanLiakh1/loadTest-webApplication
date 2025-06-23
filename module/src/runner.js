import { sendRequest } from "./request.js";

async function startTesting({ url, duration, concurrency, method, body}) {
    const endTime = Date.now() + duration * 1000;
    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(
            (async () => {
                while (Date.now() < endTime) {
                    await sendRequest({ url, method, body });
                }
            })()
        );
    }
}

export { startTesting };