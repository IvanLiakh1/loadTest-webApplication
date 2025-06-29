import axios from "axios";

async function sendRequest({ url, method, body, token }) {
	const start = Date.now();
	try {
		const config = {
			method,
			url,
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
		};

		if (body !== null && body !== undefined) {
			config.data = body;
		}

		const response = await axios(config);
		return {
			success: true,
			status: response.status,
			data: response.data,
			requestBody: body,
			requestMethod: method,
			requestUrl: url,
			time: Date.now() - start,
		};
	} catch (error) {
		return {
			success: false,
			requestBody: body,
			requestMethod: method,
			requestUrl: url,
			requestToken: token,
			status: error.response?.status || null,
			statusText: error.response?.statusText || null,
			error: error.response?.data?.message || error.message,
			time: Date.now() - start,
		};
	}
}

export { sendRequest };
