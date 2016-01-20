import Promise from 'bluebird'
import path from 'path'
import fs from 'fs-extra'
import exec from '../exec'

const readJsonAsync = Promise.promisify(fs.readJson)

const getCurrentlyInstalledDependencies = Promise.coroutine(
  function* (deps, dir) {
    const list = []
    for (let dep of deps) {
      const depPackagePath = path.join(dir, 'node_modules', dep, 'package.json')
      const content = yield readJsonAsync(depPackagePath)
      list.push({ dep, version: content.version })
    }
    return list
  }
)

const updateDependencies = Promise.coroutine(
  function* (depVersions) {
    for (let dep of depVersions) {
      const cmd = 'npm install ' + dep.dep
      yield exec(cmd)
    }
  }
)

const compareVersions = (depVersions, updatedDepVersions) => {
  // Now compare to get a list of upgrades
  // We're assuming the lists match 
  depVersions.forEach((oldVersion, index) => {
    const newVersion = updatedDepVersions[index]
    const different = oldVersion.version != newVersion.version
        
    if (different) {
      console.log('%s updated from `%s` to `%s`', oldVersion.dep, oldVersion.version, newVersion.version)
    }
  }) 
}

export default Promise.coroutine(
  function* (dir) {
    const packagePath = path.join(dir, 'package.json')
    const contents = yield readJsonAsync(packagePath)
    const depVersions = yield getCurrentlyInstalledDependencies(Object.keys(contents.dependencies), dir)
    yield updateDependencies(depVersions)
    const updatedDeps = depVersions.map(depObj => depObj.dep)
    const updatedDepVersions = yield getCurrentlyInstalledDependencies(updatedDeps, dir)
    compareVersions(depVersions, updatedDepVersions)
  }
) 