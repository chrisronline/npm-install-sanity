import setup from './lib/setup'
import verify from './lib/verify'
import pickStrategies from './lib/pickStrategies'
import rimraf from 'rimraf'
import Promise from 'bluebird'

const rm = Promise.promisify(rimraf)

const run = Promise.coroutine(
  function*() {
    // Setup our test environment - this involves copying from the source
    // into a temporary directory so we aren't affecting actual versions
    const sandboxPath = yield setup()
    
    // Verify there is actually an issue with `npm install`
    const verifyResult = yield verify(sandboxPath)
    if (verifyResult === false) {
      yield rm(sandboxPath)
      return '`npm install` works fine'
    }
    
    // Based on the error message from `npm install`, pick a list
    // of strategies to fix the error and then execute each strategy
    const strategies = pickStrategies(verifyResult)
    for (let strategy of strategies) {
      yield strategy(sandboxPath)
    }
    
    // Check again if `npm install` works
    const reVerifyResult = yield verify(sandboxPath)
    if (reVerifyResult === false) {
      yield rm(sandboxPath)
      return '`npm install` is now working'
    }
    
    yield rm(sandboxPath)
    return 'Unable to fix `npm install` issues'
  }
)

run()
  .then((msg) => console.log(msg))
  .catch((e) => console.warn(e))

