const path = require('path')
const Promise = require('bluebird')
const ffmpeg = require('fluent-ffmpeg')

const splitSingleVideoToImages = (imageOutputDir) => (inputDir) => (filename) => {
  const {
    name
  } = path.parse(filename)
  const lowercaseName = name.toLowerCase()
  const fullInputFilename = inputDir ? `${inputDir}/${filename}` : filename
  const outputFilenamePattern = `${imageOutputDir}/${lowercaseName}-frame-%d.png`
  return new Promise((resolve, reject) => {
    return ffmpeg(fullInputFilename)
      .on('start', () => console.log(`Splitting '${fullInputFilename}' -> '${outputFilenamePattern}'`))
      .on('end', () => resolve('done'))
      .on('error', (err) => reject(err))
      .output(outputFilenamePattern)
      .run()
  })
}

module.exports = {
  splitSingleVideoToImages
}
