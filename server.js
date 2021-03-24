import WebSocket from 'ws'
import cypress from './cypressExec.js'
import { getWebsocketUrl, sendMessageToSlack } from './axios.js'

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
        cypress(responseUrl, 'birthday')
          .then(testResult => sendMessageToSlack(responseUrl, testResult))
          .catch(error => console.log(error))
      })

    // responseUrl && testResult && sendMessageToSlack(responseUrl, testResult)
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
