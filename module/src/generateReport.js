import fs from "fs";
import open from "open";
export function generateReport(data, filename = "report.html") {
	const m = data.metrics;
	const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Звіт про навантаження</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css" />
</head>
<body>
  <main class="container">
    <h1>Звіт про навантаження</h1>
    <table>
          <tr><th>Запитів</th><td>${m.totalRequests}</td></tr>
          <tr><th>Успішні</th><td>${m.successfulRequests}</td></tr>
          <tr><th>Неуспішні</th><td>${m.failedRequests}</td></tr>
          <tr><th>Середній час</th><td>${m.avgTime} мс</td></tr>
          <tr><th>Макс.час запиту</th><td>${m.maxTime} мс</td></tr>
          <tr><th>Мін.час запиту</th><td>${m.minTime} мс</td></tr>
          <tr><th>RPS</th><td>${m.rps}</td></tr>
          <tr><th>Стандартне відхилення</th><td>${m.stddev} мс</td></tr>
          <tr><th>95-й перцентиль</th><td>${m.p95} мс</td></tr>
          <tr><th>99-й перцентиль</th><td>${m.p99} мс</td></tr>
        </table>

    <section id="statusCodes">
      <h2>Статуси запитів</h2>
      <table>
        <thead><tr><th>Код статусу</th><th>Кількість</th></tr></thead>
        <tbody>
          ${Object.entries(data.metrics.statusCounts)
				.map(([code, count]) => `<tr><td>${code}</td><td>${count}</td></tr>`)
				.join("")}
        </tbody>
      </table>
    </section>

    <section id="errors">
      <h2>Помилки</h2>
      <pre style="color: red;">${
			data.results
				.filter((r) => !r.success && r.error)
				.map((r) => r.error)
				.join("\n") || "Немає"
		}</pre>
    </section>
  </main>
</body>
</html>`;
	fs.writeFileSync(filename, html, "utf-8");
	open(filename);
}
