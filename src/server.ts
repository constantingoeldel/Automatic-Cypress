//tsignore
import WebSocket, { Data, MessageEvent, OpenEvent } from 'ws'

import cypress from './cypressExec.js'
import { getWebsocketUrl, sendMessageToSlack } from './axios.js'
import { shareMedia, dissectMessage, shareTestResult, supportedApp } from './helpers.js'

interface open extends OpenEvent {
  type?: string
}

const supportedApps: supportedApp[] = ['birthday', 'photo', 'country']
connectToSlack()

async function connectToSlack() {
  const slackUrl = await getWebsocketUrl()
  const Slack = new WebSocket(slackUrl)

  Slack.onopen = (msg: open) => console.log('Websocket status: ', msg.type)

  Slack.onerror = error => console.log('An error occurred when connecting to Slack: ', error)

  Slack.onmessage = msg => {
    const parsedMessage = typeof msg.data === 'string' && JSON.parse(msg.data)
    const responseUrl = parsedMessage?.payload?.response_url
    console.log('The event type is: ' + parsedMessage.type)

    parsedMessage.envelope_id && Slack.send(JSON.stringify({ envelope_id: parsedMessage.envelope_id }))

    if (parsedMessage.type === 'interactive') {
      const message = dissectMessage(supportedApps, parsedMessage)
      sendMessageToSlack(
        responseUrl,
        message.ok
          ? ':robot_face: Running test for ' + message.type + ' app on url ' + message.url + '!'
          : 'I can not find any valid link in this message. If there should be one, please contact Constantin'
      )
      message.ok &&
        cypress(message.url, message.type)
          .then(testResult => {
            shareMedia(parsedMessage.envelope_id)
            shareTestResult(parsedMessage.envelope_id, testResult)
            sendMessageToSlack(
              responseUrl,
              `:robot_face: Your test result is now available @  **http://192.168.50.233:3000/ftp/CypressTests/${parsedMessage.envelope_id}**. \n It contains a written summary of the test as well as screenshots and videos of failed tests :)`
            )
          })
          .catch(error => console.log(error))
    }
  }
  return Slack
}
