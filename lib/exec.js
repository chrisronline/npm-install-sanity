import Promise from 'bluebird'
import shell from 'shelljs'

export default cmd => {
  // return shell.execAsync(cmd, { silent: true })
  return new Promise((resolve, reject) => {
    shell.exec(cmd, { silent: true }, (code, stdout, stderr) => {
      if (code === 0) {
        resolve(true)
      }
      else {
        resolve({ stdout, stderr })
      }
    })
  })
}