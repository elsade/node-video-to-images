const fs = require('fs')

const createOutputDirectory = (outputDir) => {
  try {
    fs.mkdirSync(outputDir)
    console.log(`Created output directory '${outputDir}'`)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
}

module.exports = createOutputDirectory
