import fs from "fs";
import path from "path";

const folderPath = "../testcases";
const fileName = "testCases.json";
const filePath = path.join(folderPath, fileName);

function saveTestCase(testCase) {
	let testCases = [];

	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
	}

	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf8");
		testCases = JSON.parse(data);
	}

	testCases.push(testCase);
	fs.writeFileSync(filePath, JSON.stringify(testCases, null, 2), "utf8");
	console.log("✅ Тестовий кейс збережено у", filePath);
}

function readTestCases() {
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	}
	return [];
}

export { saveTestCase, readTestCases };
