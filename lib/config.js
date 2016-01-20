import path from 'path'

export const normalizePath = (_path) => {
  const normalized = path.normalize(_path)
  if (normalized.endsWith(path.sep)) {
    return normalized.substr(0, normalized.length - 1)
  }
  return normalized
}
export const src = normalizePath(process.argv.slice(2)[0] || process.cwd())