const path = require('path')
const Promise = require('bluebird')
const {
  Either
} = require('monet')

const {
  splitSingleVideoToImages
} = require('./split-video-file')

const readDir = require('./read-dir')

const {
  Right,
  Left
} = Either

const videoExtensions = [
  'mp4',
  'avi',
  'mov'
]

/**
 * Extract the extension from a filename
 *
 * @param {string} filename
 */
const getExtension = (filename) => {
  const {
    ext
  } = path.parse(filename)
  const [, extNoDot] = ext.split('.')
  return extNoDot ? extNoDot.toLowerCase() : ''
}

/**
 * Determine if a filename matches a video file extension list
 *
 * @param {string []} videoExtensions
 * @param {string} filename
 */
const isVideoFile = (videoExtensions) => (filename) => {
  return videoExtensions.includes(getExtension(filename))
}

const executeSplitFilelist = async (inputDir, outputDir, videoFilenamesPromise) => {
  return videoFilenamesPromise.then((filenames) => {
    return Promise.all(filenames.map(splitSingleVideoToImages(outputDir)(inputDir)))
  })
}

const splitAllVideos = async (options) => {
  const {
    inputDir,
    inputFile,
    outputDir
  } = options

  // given either an input file or an input directory
  let eitherFilelist = !inputFile ? Left(inputDir) : Right(inputFile)
  return eitherFilelist
    .cata(
      // read the input directory to get a file list
      (inputDir) => inputDir ? Right(readDir(inputDir)) : Left(Promise.reject(new Error('No input directory'))),
      // create a list for the single file
      (file) => Right(Promise.resolve([file]))
    )
    // filter the list to get only video files
    .map((promiseToFilelist) => promiseToFilelist.then((list) => list.filter(isVideoFile(videoExtensions))))
    // either we have some remaining files in our list or we have an error
    .flatMap((promiseToFilelist) => {
      return Right(promiseToFilelist.then((list) => (list.length > 0) ? list : new Error('Empty file list')))
    })
    .cata(
      // if we have no remaing files in the list, log the error
      (error) => console.error(error, 'Unable to split file list'),
      // call the split function on each file in the list
      (listPromise) => executeSplitFilelist(inputDir, outputDir, listPromise)
    )
}

module.exports = {
  splitAllVideos,
  splitSingleVideoToImages,
  getExtension,
  isVideoFile
}
