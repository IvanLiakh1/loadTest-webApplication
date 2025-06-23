import fs from "fs";
import path from "path";
function saveTestCase(testCase) {
	const filePath = path.join("testCases.json");
	let testCases = [];
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf8");
		testCases = JSON.parse(data);
	}
	testCases.push(testCase);
	fs.writeFileSync(filePath, JSON.stringify(testCases, null, 2), "utf8");
	console.log("Тестовий кейс збережено.");
}
function readTestCases() {
	const filePath = path.join("testCases.json");
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, "utf8");
		return JSON.parse(data);
	}
}
export { saveTestCase, readTestCases };
