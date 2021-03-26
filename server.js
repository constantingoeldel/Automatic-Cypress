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
        sendMessageToSlack(
          responseUrl,
          ':robot_face: Running test for birthday app on url ' + url + '!'
        )
        cypress(url, 'birthday')
          .then(testResult => {
            shareMedia(parsedMessage.envelope_id)
            shareTestResult(parsedMessage.envelope_id, testResult)
            sendMessageToSlack(
              responseUrl,
              `:robot_face: Your test result is now available @  **http://192.168.50.233:3000/ftp/CypressTests/${testIdentifier}**. \n It contains a written summary of the test as well as screenshots and videos of failed tests :)`
            )
          })
          .catch(error => console.log(error))
      })
  }
  return Slack
}
