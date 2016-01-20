import shell from 'shelljs'
import exec from './exec'

export default (path) => {
  shell.cd(path)
  return exec('npm install --registry=http://npm.thorhudl.com')
    .then(result => {
      if (result === true) return false
      return result.stderr || result.stdout
    })
}