import https from 'https';
export async function callApi(options, data = null) {
    return new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
            let responseData = "";
            response.on("data", (chunk) => {
                responseData += chunk;
            });
            response.on("end", () => {
                if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
                    // Request was successful
                    resolve({
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                        data: JSON.parse(responseData)
                    });
                }
                else {
                    // Request failed
                    resolve({
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                    });
                }
            });
        });
        request.on("error", (error) => {
            reject(error);
        });
        if (data) {
            request.write(data);
        }
        request.end();
    });
}
