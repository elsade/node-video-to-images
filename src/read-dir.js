const {
  promisify
} = require('util')

const {
  readdir
} = require('fs')

const readdirAsync = promisify(readdir)

const readDir = async function (dirName) {
  try {
    const result = await readdirAsync(dirName)
    // console.log(`readDir `, { result })
    return result
  } catch (err) {
    return console.log(`Unable to read files from ${dirName}: `, {
      err
    })
  }
}

module.exports = readDir
