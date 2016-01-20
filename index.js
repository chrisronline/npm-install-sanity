import setup from './lib/setup'
import verify from './lib/verify'
import pickStrategies from './lib/pickStrategies'
import rimraf from 'rimraf'
import Promise from 'bluebird'

let sandboxPath = null
setup()
  .then(path => {
    sandboxPath = path
    return verify(sandboxPath)
  })
  .then(err => {
    if (err === false) {
      throw '`npm install` works fine. Chill bro'
    }
    return pickStrategies(err)
  })
  .then(strategies => Promise.all(strategies.map(strategy => strategy(sandboxPath))))
  .then(() => verify(sandboxPath))
  .then(err => {
    if (err === false) {
      console.log('yay fixed')
    } else {
      console.log('no dice')
    }
  })
  .finally(() => {
    rimraf(sandboxPath, {}, () => {})
  })

