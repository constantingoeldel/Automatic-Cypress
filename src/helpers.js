import { exec } from 'child_process'
import { stderr, stdout } from 'process'

export function shareMedia(testIdentifier) {
  exec(
    `cp -r /home/onja/cypress/Automatic-Cypress/cypress/screenshots/birthdayApp.spec.js/ /home/onja/onja-be/public/ftp/CypressTests && cd  /home/onja/onja-be/public/ftp/CypressTests/ && mv birthdayApp.spec.js/ ${testIdentifier} && cd ${testIdentifier} && rename 's/The ultimate test for the birthday app -- /Test /' *.png && cp /home/onja/cypress/Automatic-Cypress/cypress/videos/birthdayApp.spec.js.mp4 /home/onja/onja-be/public/ftp/CypressTests/${testIdentifier}/ && mv birthdayApp.spec.js.mp4 Video_of_Test.mp4`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error)
      }
      if (stderr) {
        console.log(stderr)
      }
      console.log('sharing media...')
    }
  )
}

export function shareTestResult(testIdentifier, text) {
  exec(
    `cd /home/onja/onja-be/public/ftp/CypressTests/${testIdentifier} && echo ${text} > Test_Result.txt`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error)
      }
      if (stderr) {
        console.log(stderr)
      }
      console.log('sharing test result...')
    }
  )
}

export function dissectMessage(message) {
  const content = message.payload.message.text
  const urls = content.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm
  )
  return urls && urls.filter(url => url.includes('netlify') | url.includes('vercel'))
}
