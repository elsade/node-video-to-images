import Bluebird from 'bluebird'
import {
  curry
} from 'lodash'
import {
  Either
} from 'monet'
import path from 'path'
import {
  readDir
} from './read-dir'
import {
  splitSingleVideoToImages
} from './split-video-file'

const {
  Right,
  Left
} = Either

/**
 * List of valid video file extensions
 */
const videoExtensions: string[] = ['mp4', 'avi', 'mov', 'gif', 'mkv']

/**
 * Extract the extension from a filename
 */
const getExtension = (filename: string) => {
  const {
    ext
  } = path.parse(filename)
  const [, extNoDot] = ext.split('.')
  return extNoDot ? extNoDot.toLowerCase() : ''
}

/**
 * Determine if a filename matches a video file extension list
 */
const isVideoFile = (extensions: string[]) => (filename: string) => {
  return extensions.includes(getExtension(filename))
}

/**
 * Given a list of files and directory information, split each into images and save
 * the results in an output directory
 */
const executeSplitFilelist = (outputDir: string, videoFilenames: string[]) => {
  return Promise.all(
    videoFilenames.map((filename) => splitSingleVideoToImages(outputDir, filename))
  )
}

const splitVideosPipeline = async (options: any) => {
  const { inputDir, inputFile, outputDir } = options

  const eitherInputOrDir = (file: string, dir: string): Either<string, string> => {
    return !file ? Left(dir) : Right(file)
  }

  // given either an input file or an input directory
  await eitherInputOrDir(inputFile, inputDir)
    .cata(
      (dir: string): Promise<string[]> => (dir ? readDir(dir) : Promise.resolve([])),
      (filename: string): Promise<string[]> => Promise.resolve([filename])
    )
    .then((list: string[]) => list.filter(isVideoFile(videoExtensions)))
    .then((list: string[]) =>
      list.map((filename: string) => (inputDir ? `${inputDir}/${filename}` : filename))
    )
    .then((list: string[]) => (list.length > 0 ? Right(list) : Left(new Error('empty file list'))))
    .then((eitherFilelistOrError: Either < Error, string[] > ) => {
      return eitherFilelistOrError.cata(
        (error: Error) => console.error({
          error
        }, `Unable to split the file list`),
        (list: string[]) => executeSplitFilelist(outputDir, list)
      )
    })
}

export {
  splitVideosPipeline,
  splitSingleVideoToImages,
  getExtension,
  isVideoFile
}
