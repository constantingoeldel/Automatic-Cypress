// const { exec } = require('child_process')
import { exec } from 'child_process'

export default function cypress(url, app) {
  console.log(`Cypress test started for ${app} app on url ${url}`)
  console.log(`URL=${url} npm run ${app}`)
  const testResult = exec(`URL=${url} npm run ${app}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error}`)
      return error
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return stderr
    }
    console.log(`stdout: ${stdout}`)
    return stdout
  })
  return testResult
}

cypress('https://acctive.digital', 'birthday')
