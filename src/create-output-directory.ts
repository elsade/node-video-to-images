import fs from 'fs'

const createOutputDirectory = (outputDir: string) => {
  try {
    fs.mkdirSync(outputDir)
    console.log(`Created output directory '${outputDir}'`)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
}

export {
  createOutputDirectory
}

