require('dotenv').config()
const axios = require('axios')

export async function getWebsocketUrl() {
  let response
  const request = {
    method: 'post',
    url: 'https://slack.com/api/apps.connections.open',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.REVIEW_TOKEN,
    },
  }
  try {
    response = await axios(request)
  } catch (error) {
    console.log(error)
  }
  response.data.ok ||
    console.log('Error when attempting to get Websocket URL: ', response.data.error)
  return response.data.url
}

export async function sendMessageToSlack(url, text) {
  let messageResponse
  const messageToSlack = {
    method: 'POST',
    url: url,
    headers: { 'Content-Type': 'application/json' },
    data: { text: text },
  }
  try {
    messageResponse = await axios(messageToSlack)
  } catch (error) {
    console.log(error)
  }
  return messageResponse.data
}
