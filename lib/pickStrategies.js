import peerDependency from './strategies/peerDependency'

export default (log) => {
  if (log.indexOf('ERR! peerinvalid')) {
    return [peerDependency]
  }
}