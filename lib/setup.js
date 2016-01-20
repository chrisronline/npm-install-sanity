import fs from 'fs-extra'
import tmp from 'tmp'
import rimraf from 'rimraf'
import Promise from 'bluebird'
import { src } from './config'

const dirAsync = Promise.promisify(tmp.dir)
const copyAsync = Promise.promisify(fs.copy)

const includeInCopy = (file) => {
  // Only include the package.json file and the node_modules directory
  if (file !== src && file.indexOf('node_modules') === -1 && file.indexOf('package.json') === -1) {
    return false
  }
  return true
}

export default Promise.coroutine(
  function* () {
    const tmpDir = yield dirAsync()
    yield copyAsync(src, tmpDir, { filter: includeInCopy })
    return tmpDir
  }
) 