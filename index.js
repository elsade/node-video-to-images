#!/usr/bin/env node

const minimist = require('minimist')
const {
  splitAllVideos
} = require('./src/split-video-file')

const createOutputDirectory = require('./src/create-output-directory')

const argv = minimist(process.argv.slice(2))

try {
  const inputDir = argv['d']
  const inputFile = argv['i']
  const outputDir = argv['o'] || './output'

  // create the output directory if needed
  createOutputDirectory(outputDir)

  splitAllVideos({
    inputDir,
    inputFile,
    outputDir
  })
} catch (error) {
  console.error('Unhandled exception: ', {
    error
  })
}
