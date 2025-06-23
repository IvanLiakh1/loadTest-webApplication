import axios from 'axios';

async function sendRequest ({url, method, body}) {
    const start = Date.now();
    try {
        const response = await axios({
            method: method,
            url: url,
            data: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return {success: true, status: response.status, time: Date.now() - start};
    }
    catch (error) {
        return { success: false, error: err.message, time: Date.now() - start };
    }
}

export {sendRequest};