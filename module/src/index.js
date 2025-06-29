import { startTesting } from "./runner.js";
import readline from "readline";
import Test from "../models/test.js";
import { readTestCases, saveTestCase } from "./testCases.js";

let test;
let save;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function askQuestion(question) {
	return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

function isYes(input) {
	return ["y", "yes", "так", "1"].includes(input.toLowerCase());
}

async function newTestCase() {
	const url = await askQuestion("Введіть URL для тестування: ");
	const duration = parseInt(await askQuestion("Введіть тривалість тесту (в секундах): "), 10);
	const concurrency = parseInt(await askQuestion("Введіть кількість одночасних запитів: "), 10);
	const method = (await askQuestion("Введіть метод (GET, POST, PUT, DELETE): ")).toUpperCase();
	const token = await askQuestion("Введіть токен авторизації якщо потрібно, інакше, залиште поле порожнім: ");
	if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
		console.error("❌ Невірний метод. Доступні: GET, POST, PUT, DELETE.");
		rl.close();
		return;
	}

	let body = null;
	if (["POST", "PUT"].includes(method)) {
		const raw = await askQuestion("Введіть тіло запиту (JSON): ");
		try {
			body = JSON.parse(raw);
		} catch (error) {
			console.error("❌ Помилка парсингу JSON:", error.message);
			rl.close();
			return;
		}
	}

	save = await askQuestion("Чи зберігати метрики у файл? (y/n): ");
	if (!isYes(save)) {
		save = false;
	}

	test = new Test({ url, duration, concurrency, method, body, save, token });
}
async function main() {
	console.log("🚀 Load Test Web Application");
	const testCases = readTestCases();
	let option;

	if (testCases != undefined && testCases.length > 0) {
		console.log("\n📦 Доступні тестові кейси:");
		testCases.forEach((t, i) => {
			console.log(`${i + 1}. URL: ${t.url}, Метод: ${t.method}, Тривалість: ${t.duration}s, Конкуренція: ${t.concurrency}`);
		});
		option = await askQuestion("\nВиберіть опцію:\n1. Запустити новий тест\n2. Завантажити тестовий кейс\nВведіть номер опції: ");

		if (option === "2" && testCases.length > 0) {
			const index = parseInt(await askQuestion("Введіть номер тестового кейсу для завантаження: ")) - 1;
			if (isNaN(index) || index < 0 || index >= testCases.length) {
				console.error("❌ Невірний номер тестового кейсу.");
				rl.close();
				return;
			}
			test = new Test(testCases[index]);
		} else if (option === "1" || testCases.length === 0) {
			await newTestCase();
		} else {
			console.error("❌ Невірна опція.");
			rl.close();
			return;
		}
	} else {
		option = "1";
		await newTestCase();
	}

	await startTesting(test);

	if (option === "1") {
		let saveTest = await askQuestion("Зберегти цей тестовий кейс? (y/n): ");
		if (isYes(saveTest)) {
			saveTestCase(test);
		}
	}
	rl.close();
}

main().catch((err) => {
	console.error("❌ Помилка:", err.message);
	rl.close();
});
