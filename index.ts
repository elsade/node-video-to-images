#!/usr/bin/env node

import minimist from 'minimist'
import {
  splitAllVideos
} from './src/split-pipeline'

const {
  createOutputDirectory
} from './src/create-output-directory'

const argv = minimist(process.argv.slice(2))

const toOptions = (argv) => ({
  inputDir: argv['d'],
  inputFile: argv['i'],
  outputDir: argv['o'] || './output'
})

const options = toOptions(argv)

try {
  // create the output directory if needed
  createOutputDirectory(options.outputDir)

  splitAllVideos(toOptions(argv))
} catch (error) {
  console.error('Unhandled exception: ', {
    error
  })
}
