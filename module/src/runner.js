import { sendRequest } from "./request.js";
import MetricsCollector from "./metrics.js";

const metrics = new MetricsCollector();

async function startTesting(test) {
	metrics.save = test.save;
	const endTime = Date.now() + test.duration * 1000;
	const workers = [];
	const url = test.url;
	const method = test.method;
	const body = test.body ? JSON.stringify(test.body) : null;
	const token = test.token;
	for (let i = 0; i < test.concurrency; i++) {
		workers.push(
			(async () => {
				while (Date.now() < endTime) {
					metrics.record(await sendRequest({ url, method, body, token }));
				}
			})()
		);
	}

	await Promise.all(workers);

	metrics.printSummary(test.duration);
}

export { startTesting };
