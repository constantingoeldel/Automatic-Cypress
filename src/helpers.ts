import { exec } from 'child_process'

export type supportedApp = 'birthday' | 'photo' | 'country'

interface msg {
  payload: {
    message: {
      text: string
    }
  }
}

type dissectedMessage =
  | {
      ok: true
      url: string
      type: supportedApp
    }
  | {
      ok: false
      url: null
      type: null
    }

export function shareMedia(testIdentifier: string, test: supportedApp, testResult: string) {
  exec(
    `cp -r /home/onja/cypress/Automatic-Cypress/cypress/screenshots/${test}.spec.js/ /home/onja/onja-be/public/ftp/CypressTests && cd  /home/onja/onja-be/public/ftp/CypressTests/ && mv ${test}.spec.js/ ${testIdentifier} && cd ${testIdentifier} && rename 's/The ultimate test for the birthday app -- /Test /' *.png && cp /home/onja/cypress/Automatic-Cypress/cypress/videos/${test}.spec.js.mp4 /home/onja/onja-be/public/ftp/CypressTests/${testIdentifier}/ && mv ${test}.spec.js.mp4 Video_of_Test.mp4`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error)
      }
      if (stderr) {
        console.log(stderr)
      }
      console.log('sharing media...')
      shareTestResult(testIdentifier, testResult)
    }
  )
}

export function shareTestResult(testIdentifier: string, text: string) {
  exec(`cd /home/onja/onja-be/public/ftp/CypressTests/${testIdentifier}/ && echo "${text}" > Test_Result.txt`, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
    }
    if (stderr) {
      console.log(stderr)
    }
    console.log('sharing test result...')
  })
}

export function dissectMessage(supportedApps: supportedApp[], message: msg): dissectedMessage {
  const content = message.payload.message.text
  const urls = content.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm)
  const deployedUrl = (urls && urls.filter(url => url.includes('netlify') || url.includes('vercel'))[0]) || null
  const type = supportedApps.filter(app => content.toLowerCase().includes(app))[0] || null

  if (deployedUrl && type) {
    return {
      ok: true,
      url: deployedUrl,
      type: type,
    }
  } else {
    return {
      ok: false,
      url: null,
      type: null,
    }
  }
}
