#!/usr/bin/env node

import { splitVideosPipeline } from './split-pipeline'

import { createOutputDirectory } from './create-output-directory'

import minimist from 'minimist'

const toOptions = (args: minimist.ParsedArgs) => {
  return {
    inputDir: args['d'],
    inputFile: args['i'],
    outputDir: args['o'] || './output'
  }
}

const main = () => {
  const argv = minimist(process.argv.slice(2))
  const options = toOptions(argv)

  try {
    // create the output directory if needed
    createOutputDirectory(options.outputDir)

    // split the video files into images and put them into the output directory
    splitVideosPipeline(options)
  } catch (error) {
    console.error('Unhandled exception: ', {
      error
    })
  }
}

main()
