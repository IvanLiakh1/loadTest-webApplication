import { sendRequest } from "./request.js";
import MetricsCollector from "./metrics.js";

const metrics = new MetricsCollector();

async function startTesting({ url, duration, concurrency, method, body }) {
	const endTime = Date.now() + duration * 1000;
	const workers = [];
	for (let i = 0; i < concurrency; i++) {
		workers.push(
			(async () => {
				while (Date.now() < endTime) {
					metrics.record(await sendRequest({ url, method, body }));
				}
			})()
		);
	}

	await Promise.all(workers);

	metrics.printSummary(duration);
}

export { startTesting };
