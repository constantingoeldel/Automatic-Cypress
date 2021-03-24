const WebSocket = require('ws')

import cypress from './cypress'
import { getWebsocketUrl, sendMessageToSlack } from './axios'

connectToSlack()

async function connectToSlack() {
  const slackUrl = await getWebsocketUrl()
  const Slack = new WebSocket(slackUrl)

  Slack.onopen = msg => console.log('Websocket status: ', msg.type)

  Slack.onerror = error => console.log('An error occurred when connecting to Slack: ', error)

  Slack.onmessage = msg => {
    const parsedMessage = JSON.parse(msg.data)
    const responseUrl = parsedMessage?.payload?.response_url
    console.log('The event type is: ' + parsedMessage.type)

    parsedMessage.envelope_id &&
      Slack.send(JSON.stringify({ envelope_id: parsedMessage.envelope_id }))

    const testResult =
      parsedMessage.type === 'interactive' &&
      dissectMessage(parsedMessage).forEach(url => cypress(url, 'birthday'))

    responseUrl && testResult && sendMessageToSlack(responseUrl, testResult)
  }
  return Slack
}

function dissectMessage(message) {
  const content = message.payload.message.text
  const urls = content.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm
  )
  return urls && urls.filter(url => url.includes('netlify') | url.includes('vercel'))
}
