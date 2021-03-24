const { exec } = require('child_process')

export default function cypress(url, app) {
  console.log(`Cypress test started for ${app} app on url ${url}`)
  const testResult = exec(`URL=${url} npm run ${app}`, (error, stdout, stderr) => {
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
  return testResult
}

cypress('https://acctive.digital', 'birthday')
