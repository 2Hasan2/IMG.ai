const API_KEYS = [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImIwZTMyNDM0MzQ1ZWE0YzE0YWNiYTdjMDc2OTE0YTM4IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMjA6MDI6MDYuOTQ3MDQwIn0.yk4MckTltMjfAAWNSifU84zXHBJug0pVnNuui9r3u3I',
    // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImE5MTcxZTUxZTViYmVjNGM5ZDUyMzg1OGI3Mzc1Zjk3IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTRUMTM6Mjc6NTQuNzk4MDE4In0.Qo6a7JkEsLlVIwN3WqQzLE4HpElq_BAdJB5tOsRHgqE',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjNjOTY1ZjI5MjY1NmM4NDYwZWY1ZmFlZTQ5MzQ0Y2M2IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTZUMjA6MDg6MTQuMDM0NDU3In0.7npW-1vmQTzHdTUTyRi1m-tPURFHBGe8gyPg224_SiU',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE0YmQ3MzhhNDYzZTUyYTNlMWU3YWYyYzE3MDNkYjkyIiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMThUMTM6Mjc6NTUuNDg0ODcxIn0.qNW45nzrLI0a_X0Iz3RfPqYYUMgN8tzE4eIc5FI_MGA',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjczNDM5OTQzNjBlNWMyZWYyNDUwZWMyZTZhN2YxOGM0IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMThUMTM6Mjk6MjQuNzQ2NjA3In0.jNinAikdCPbcCI2n-rt2r0PGQOZH5Z7N49f2JYMg0Tw',
]

let Time = 0;

const URL = 'https://api.monsterapi.ai/v1/generate/sdxl-base';

// text to image
async function sendAndFetchResult(options) {
    const API_KEY = API_KEYS[Time];
    console.log(API_KEY);
    Time++;
    if (Time >= API_KEYS.length) {
        Time = 0;
    }
    let num=0;
    try {
        const sendOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify(options)
        };

        const sendResponse = await fetch(URL, sendOptions);
        const sendResult = await sendResponse.json();

        const getResult = async (process_id) => {
            const getOptions = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${API_KEY}`
                }
            };

            const getStatusResponse = await fetch(`https://api.monsterapi.ai/v1/status/${process_id}`, getOptions);
            const statusResult = await getStatusResponse.json();

            if (statusResult.status === 'IN_PROGRESS' || statusResult.status === 'IN_QUEUE') {
                return new Promise(resolve => setTimeout(() => resolve(getResult(process_id)), 800));
            } else if (statusResult.status === 'COMPLETED') {
                return statusResult.result.output;
            } else {
                throw new Error(JSON.stringify(statusResult));
            }
        };

        return getResult(sendResult.process_id);
    } catch (error) {
        throw new Error(error);
    }
}

// pix to pix
