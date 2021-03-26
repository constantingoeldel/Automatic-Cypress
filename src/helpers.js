import { exec } from 'child_process'

export function shareMedia(testIdentifier) {
  exec(
    `cp -r /home/onja/cypress/Automatic-Cypress/cypress/screenshots/birthdayApp.spec.js/ /home/onja/onja-be/public/ftp/CypressTests && cd  /home/onja/onja-be/public/ftp/CypressTests/ && mv birthdayApp.spec.js/ ${testIdentifier} && cd ${testIdentifier} && rename 's/The ultimate test for the birthday app -- /Test /' *.png && cp /home/onja/cypress/Automatic-Cypress/cypress/videos/birthdayApp.spec.js.mp4 /home/onja/onja-be/public/ftp/CypressTests/${testIdentifier}/ && mv birthdayApp.spec.js.mp4 Video_of_Test.mp4`
  )
}

export function dissectMessage(message) {
  const content = message.payload.message.text
  const urls = content.match(
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm
  )
  return urls && urls.filter(url => url.includes('netlify') | url.includes('vercel'))
}
