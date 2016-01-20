import setup from './lib/setup'
import verify from './lib/verify'
import pickStrategies from './lib/pickStrategies'
import rimraf from 'rimraf'
import Promise from 'bluebird'

const rm = Promise.promisify(rimraf)

function* run() {
  const sandboxPath = yield setup()
  const verifyResult = yield verify(sandboxPath)
  if (verifyResult === false) {
    yield rm(sandboxPath)
    return '`npm install` works fine'
  }
  
  const strategies = pickStrategies(verifyResult)
  for (let strategy of strategies) {
    yield strategy(sandboxPath)
  }
  
  const reVerifyResult = yield verify(sandboxPath)
  if (reVerifyResult === false) {
    yield rm(sandboxPath)
    return '`npm install` is now working'
  }
  
  yield rm(sandboxPath)
  return 'Unable to fix `npm install` issues'
}

run = Promise.coroutine(run)

run()
  .then((msg) => console.log(msg))
  .catch((e) => console.warn(e))

// let sandboxPath = null
// setup()
//   .then(path => {
//     sandboxPath = path
//     return verify(sandboxPath)
//   })
//   .then(err => {
//     if (err === false) {
//       throw '`npm install` works fine. Chill bro'
//     }
//     return pickStrategies(err)
//   })
//   .then(strategies => Promise.all(strategies.map(strategy => strategy(sandboxPath))))
//   .then(() => verify(sandboxPath))
//   .then(err => {
//     if (err === false) {
//       console.log('yay fixed')
//     } else {
//       console.log('no dice')
//     }
//   })
//   .finally(() => {
//     rimraf(sandboxPath, {}, () => {})
//   })

