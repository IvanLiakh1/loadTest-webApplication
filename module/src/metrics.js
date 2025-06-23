let results = [];

function record(result) {
	results.push(result);
}

function printSummary(duration) {
	const totalRequests = results.length;
	const successfulRequests = results.filter((r) => r.success).length;
	const failedRequests = totalRequests - successfulRequests;

	const rawAvgTime =
		results.reduce((sum, r) => sum + r.time, 0) / totalRequests;
	const avgTime = rawAvgTime.toFixed(2);

	const maxTime = Math.max(...results.map((r) => r.time));
	const minTime = Math.min(...results.map((r) => r.time));
	const rps = (totalRequests / duration).toFixed(2);

	const stddev = Math.sqrt(
		results.reduce((sum, r) => sum + Math.pow(r.time - rawAvgTime, 2), 0) /
			totalRequests
	).toFixed(2);

	const sorted = results.map((r) => r.time).sort((a, b) => a - b);
	const p95 = sorted[Math.floor(0.95 * sorted.length)];
	const p99 = sorted[Math.floor(0.99 * sorted.length)];

	const errorMessages = results
		.filter((r) => !r.success && r.error)
		.map((r) => r.error)
		.join("\n");

	const statusCounts = {};
	results.forEach((result) => {
		if (result.success && typeof result.status === "number") {
			statusCounts[result.status] =
				(statusCounts[result.status] || 0) + 1;
		}
	});

	console.log(`\n=== Підсумки тестування ===`);
	console.log(`Загальна кількість запитів: ${totalRequests}`);
	console.log(`Успішні запити: ${successfulRequests}`);
	console.log(`Неуспішні запити: ${failedRequests}`);
	console.log(`Середній час відповіді: ${avgTime} мс`);
	console.log(`Максимальний час відповіді: ${maxTime} мс`);
	console.log(`Мінімальний час відповіді: ${minTime} мс`);
	console.log(`Запити в секунду (RPS): ${rps}`);
	console.log(`📉 Стандартне відхилення: ${stddev} мс`);
	console.log(`95-й процентиль: ${p95} мс`);
	console.log(`99-й процентиль: ${p99} мс`);
	console.log(`Статуси запитів:`);
	for (const [code, count] of Object.entries(statusCounts)) {
		console.log(`Код ${code}: ${count}`);
	}
	if (errorMessages) {
		console.log(
			`Помилки, які виникли під час тестування:\n${errorMessages}`
		);
	}
}

export { printSummary, record };
