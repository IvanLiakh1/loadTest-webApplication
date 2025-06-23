import fs from "fs";

class MetricsCollector {
	constructor(save = true) {
		this.results = [];
		this.statusCounts = {};
		this.save = save;
	}

	record(result) {
		this.results.push(result);
		if (result.success && typeof result.status === "number") {
			this.statusCounts[result.status] =
				(this.statusCounts[result.status] || 0) + 1;
		}
	}

	getMetrics(duration = 1) {
		if (duration <= 0) duration = 1;

		const totalRequests = this.results.length;
		const successfulRequests = this.results.filter((r) => r.success).length;
		const failedRequests = totalRequests - successfulRequests;

		const rawAvgTime =
			totalRequests > 0
				? this.results.reduce((sum, r) => sum + r.time, 0) /
				  totalRequests
				: 0;
		const avgTime = parseFloat(rawAvgTime.toFixed(2));

		const maxTime = totalRequests
			? Math.max(...this.results.map((r) => r.time))
			: 0;
		const minTime = totalRequests
			? Math.min(...this.results.map((r) => r.time))
			: 0;
		const rps = parseFloat((totalRequests / duration).toFixed(2));

		const stddev = totalRequests
			? parseFloat(
					Math.sqrt(
						this.results.reduce(
							(sum, r) => sum + Math.pow(r.time - rawAvgTime, 2),
							0
						) / totalRequests
					).toFixed(2)
			  )
			: 0;

		const sorted = [...this.results.map((r) => r.time)].sort(
			(a, b) => a - b
		);
		const p95 = sorted[Math.floor(0.95 * sorted.length)] || 0;
		const p99 = sorted[Math.floor(0.99 * sorted.length)] || 0;

		return {
			requestUrl: this.results[0]?.requestUrl || null,
			requestBody: this.results[0]?.requestBody || null,
			requestMethod: this.results[0]?.requestMethod || null,
			totalRequests,
			successfulRequests,
			failedRequests,
			avgTime,
			maxTime,
			minTime,
			rps,
			stddev,
			p95,
			p99,
			statusCounts: this.statusCounts,
			timestamp: new Date().toISOString(),
		};
	}

	printSummary(duration = 1) {
		const m = this.getMetrics(duration);

		console.log(`\n=== Підсумки тестування ===`);
		console.log(`Загальна кількість запитів: ${m.totalRequests}`);
		console.log(`Успішні запити: ${m.successfulRequests}`);
		console.log(`Неуспішні запити: ${m.failedRequests}`);
		console.log(`Середній час відповіді: ${m.avgTime} мс`);
		console.log(`Максимальний час відповіді: ${m.maxTime} мс`);
		console.log(`Мінімальний час відповіді: ${m.minTime} мс`);
		console.log(`Запити в секунду (RPS): ${m.rps}`);
		console.log(`📉 Стандартне відхилення: ${m.stddev} мс`);
		console.log(`95-й процентиль: ${m.p95} мс`);
		console.log(`99-й процентиль: ${m.p99} мс`);
		console.log(`Статуси запитів:`);
		for (const [code, count] of Object.entries(m.statusCounts)) {
			console.log(`Код ${code}: ${count}`);
		}

		const errorMessages = this.results
			.filter((r) => !r.success && r.error)
			.map((r) => r.error)
			.join("\n");

		if (errorMessages) {
			console.log(
				`Помилки, які виникли під час тестування:\n${errorMessages}`
			);
		}
		this.save && this.saveToFile("metrics.json", duration);
	}

	saveToFile(filename = "metrics.json", duration = 1) {
		if (fs.existsSync(filename)) {
			console.warn(
				`⚠️ Файл "${filename}" вже існує. Він буде перезаписаний.`
			);
		}
		const data = {
			metrics: this.getMetrics(duration),
			results: this.results,
		};
		fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
		console.log(`📁 Метрики збережено у файл "${filename}"`);
	}

	loadFromFile(filename = "metrics.json") {
		if (fs.existsSync(filename)) {
			const raw = fs.readFileSync(filename, "utf-8");
			const data = JSON.parse(raw);
			this.results = data.results || [];
			this.statusCounts = data.metrics?.statusCounts || {};
			console.log(`📂 Метрики завантажено з файлу "${filename}"`);
		} else {
			console.warn(`⚠️ Файл "${filename}" не знайдено`);
		}
	}
}

export default MetricsCollector;
