require('dotenv').config()
const WebSocket = require('ws')
const { exec } = require('child_process')

const Slack = new WebSocket(process.env.REVIEW_URL)

Slack.on('message', msg => {
  console.log(msg)
  Slack.send('something')
})

function cypress(url, app) {
  exec(`URL="${url}" npm run ${app}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
    }
    console.log(`stdout: ${stdout}`)
    return stdout
  })
}
// cypress('https://j-emilien-birthday-app.netlify.app/', 'birthday')
