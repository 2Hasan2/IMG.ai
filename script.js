const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImE5MTcxZTUxZTViYmVjNGM5ZDUyMzg1OGI3Mzc1Zjk3IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTItMTRUMTM6Mjc6NTQuNzk4MDE4In0.Qo6a7JkEsLlVIwN3WqQzLE4HpElq_BAdJB5tOsRHgqE';
const URL = 'https://api.monsterapi.ai/v1/generate/sdxl-base';

async function sendAndFetchResult(prompt) {
    try {
        const sendOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({ safe_filter: true, prompt })
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
                return new Promise(resolve => setTimeout(() => resolve(getResult(process_id)), 1000));
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