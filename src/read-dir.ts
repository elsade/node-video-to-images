import { readdir } from 'fs'
import { promisify } from 'util'

const readdirAsync = promisify(readdir)

/**
 * Get the list of files in a directory
 *
 * @param dirName - the name of the directory we want to see the contents of
 */
const readDir = async (dirName: string): Promise<string[]> => {
  try {
    return readdirAsync(dirName)
  } catch (err) {
    console.log(`Unable to read files from ${dirName}: `, {
      err
    })
    // return an empty file list
    return Promise.resolve([])
  }
}

export { readDir }
