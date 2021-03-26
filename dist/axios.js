import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
export async function getWebsocketUrl() {
    let response;
    const request = {
        method: 'POST',
        url: 'https://slack.com/api/apps.connections.open',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + process.env.REVIEW_TOKEN,
        },
    };
    try {
        response = await axios(request);
        response.data.ok || console.log('Error when attempting to get Websocket URL: ', response.data.error);
        return response.data.url;
    }
    catch (error) {
        console.log(error);
    }
}
export async function sendMessageToSlack(url, text) {
    console.log('Sending message to', url);
    let messageResponse;
    const messageToSlack = {
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json' },
        data: { text: text },
    };
    try {
        messageResponse = await axios(messageToSlack);
        return messageResponse.data;
    }
    catch (error) {
        console.log(error);
    }
}
