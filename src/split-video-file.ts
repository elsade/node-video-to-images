import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

const splitSingleVideoToImages = (imageOutputDir: string, filename: string): Promise<{}> => {
  const { name } = path.parse(filename)
  const lowercaseName = name.toLowerCase()
  const outputFilenamePattern = `${imageOutputDir}/${lowercaseName}-frame-%d.png`
  return new Promise((resolve, reject) => {
    return ffmpeg(filename)
      .on('start', () => console.log(`Splitting '${filename}' -> '${outputFilenamePattern}'`))
      .on('end', () => resolve('done'))
      .on('error', (err: Error) => reject(err))
      .output(outputFilenamePattern)
      .run()
  })
}

export { splitSingleVideoToImages }
