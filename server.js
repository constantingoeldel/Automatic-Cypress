require('dotenv').config()
const WebSocket = require('ws')
const { exec } = require('child_process')
const axios = require('axios')

getWebsocketUrl
  .then(response => {
    const Slack = new WebSocket(response)
    Slack.onopen = msg => {
      console.log('Server responded with:', msg.type)
    }

    Slack.onerror = error => {
      console.log(error)
    }

    Slack.onmessage = msg => {
      const parsedMessage = JSON.parse(msg.data)
      console.log('The event type is: ' + parsedMessage.type)
      parsedMessage.envelope_id &&
        Slack.send(JSON.stringify({ envelope_id: parsedMessage.envelope_id }))
      // let testOutput =
      //   parsedMessage.type === 'interactive' &&
      //   dissectMessage(parsedMessage).forEach(url => cypress(url, 'birthday'))
      parsedMessage.payload &&
        parsedMessage.payload.response_url &&
        // testOutput &&
        axios
          .post(parsedMessage.payload.response_url, {
            headers: { 'Content-Type': 'application/json' },
            data: { text: 'testOutput' },
          })
          .then(res => console.log(res))
          .catch(error => console.log(error))
    }
  })
  .catch(function (error) {
    console.log(error)
  })

function dissectMessage(message) {
  const content = message.payload.message.text
  const urls = content.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm
  )
  return urls && urls.filter(url => url.includes('netlify') | url.includes('vercel'))
}

function cypress(url, app) {
  console.log(`Cypress test started for ${app} app on url ${url}`)
  const testOutput = exec(`URL="${url}" npm run ${app}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return error
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return stderr
    }
    console.log(`stdout: ${stdout}`)
    return stdout
  })
  return testOutput
}

async function getWebsocketUrl() {
  let response
  const request = {
    method: 'post',
    url: 'https://slack.com/api/apps.connections.open',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer xapp-1-A01SM46DKLH-1885756870726-946c43458f6ccc135cad8c4d5b6cb0f3b19e7f84d3ec79698695cb7e31656b13',
    },
  }

  response = await axios(request)
  response.ok || console.log('Error when attempting to get Websocket URL: ', response.error)
  return response.url
}
