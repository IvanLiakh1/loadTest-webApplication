import { startTesting } from "./runner.js";
import readline from "readline";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function askQuestion(question) {
	return new Promise((resolve) =>
		rl.question(question, (answer) => resolve(answer.trim()))
	);
}
async function main() {
	console.log("Load Test Web Application");

	const url = await askQuestion("Введіть URL для тестування: ");
	const duration = await askQuestion(
		"Введіть тривалість тесту (в секундах): "
	);
	const concurrency = await askQuestion(
		"Введіть кількість одночасних запитів: "
	);
	const method = (
		await askQuestion("Введіть метод (GET, POST, PUT, DELETE): ")
	).toUpperCase();
	if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
		console.error(
			"Невірний метод. Будь ласка, використовуйте GET, POST, PUT або DELETE."
		);
		rl.close();
		return;
	}
	let body = null;
	if (method === "POST" || method === "PUT") {
		body = await askQuestion("Введіть тіло запиту (JSON): ");
		try {
			body = JSON.parse(body);
		} catch (error) {
			console.error("Помилка при парсингу JSON:", error.message);
			body = null;
		}
	}

	rl.close();

	startTesting({
		url,
		duration: parseInt(duration, 10),
		concurrency: parseInt(concurrency, 10),
		method,
		body,
	});
}
main().catch((err) => {
	console.error("❌ Помилка:", err.message);
	rl.close();
});
