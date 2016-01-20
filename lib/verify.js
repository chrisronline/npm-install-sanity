import shell from 'shelljs'
import exec from './exec'

export default (path) => {
  shell.cd(path)
  return exec('npm install --registry=http://npm.thorhudl.com')
    .then(() => false)
    .catch(e => e.stderr || e.stdout)
}