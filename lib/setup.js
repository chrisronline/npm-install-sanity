import fs from 'fs-extra'
import tmp from 'tmp'
import rimraf from 'rimraf'
import Promise from 'bluebird'
import { src } from './config'

const dirAsync = Promise.promisify(tmp.dir)
const copyAsync = Promise.promisify(fs.copy)

export default () => {
  return dirAsync()
    .then(path => {
      return copyAsync(src, path)
        .then(() => path)
    })
}