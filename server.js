import WebSocket from 'ws'

import cypress from './src/cypressExec.js'
import { getWebsocketUrl, sendMessageToSlack } from './src/axios.js'
import { shareMedia, dissectMessage } from './src/helpers.js'

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

    parsedMessage.type === 'interactive' &&
      dissectMessage(parsedMessage).forEach(url => {
        sendMessageToSlack(responseUrl, 'Running test for birthday app on url ' + url + '!')
        cypress(url, 'birthday')
          .then(testResult => {
            shareMedia(parsedMessage.envelope_id)
            sendMessageToSlack(responseUrl, testResult)
          })
          .catch(error => console.log(error))
      })
  }
  return Slack
}
