import { exec } from 'child_process'

export default async function cypress(url: string, app: string) {
  console.log(`Cypress test started for ${app} app on url ${url}`)

  const testResult = new Promise<string>((resolve, reject) => {
    exec(`URL="${url}" npm run ${app}`, (error, stdout, stderr) => {
      stdout && resolve(stdout)
      error && reject(error)
      stderr && reject(stderr)
    })
  })
  const result = await testResult
  return result
}
