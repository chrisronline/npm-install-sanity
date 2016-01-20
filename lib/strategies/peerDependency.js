import Promise from 'bluebird'
import path from 'path'
import fs from 'fs-extra'
import exec from '../exec'

const readJsonAsync = Promise.promisify(fs.readJson)

const getCurrentlyInstalledDependencies = (deps, dir) => {
  return Promise.all(deps.map(dep => {
    const depPackagePath = path.join(dir, 'node_modules', dep, 'package.json')
    return readJsonAsync(depPackagePath)
      .then(content => {
        return { dep, version: content.version }
      })
  }))
}

const updateDependencies = depVersions => {
  return Promise.all(depVersions.map(dep => {
    const cmd = 'npm install ' + dep.dep;
    // console.log('Updating %s', dep.dep)
    return exec(cmd)
      .then(() => {
        // console.log('Installed %s without any issue', dep.dep)
      })
      .catch((...args) => {
        // console.log('Error trying to install %s', dep.dep, args)
      })
  }))
}

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

export default (dir) => {
  const packagePath = path.join(dir, 'package.json')
  
  return readJsonAsync(packagePath)
    .then(contents => getCurrentlyInstalledDependencies(Object.keys(contents.dependencies), dir))
    .then(depVersions => {
      return updateDependencies(depVersions)
        .then(() => depVersions)
    })
    .then(depVersions => {
      const deps = depVersions.map(depObj => depObj.dep)
      return getCurrentlyInstalledDependencies(deps, dir)
        .then(updatedDepVersions => compareVersions(depVersions, updatedDepVersions))
    })
}