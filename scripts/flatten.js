import fs from 'node:fs'
import path from 'node:path'

const distDir = '.output/public'

function flattenIndexFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      flattenIndexFiles(fullPath)

      const indexFile = path.join(fullPath, 'index.html')
      if (fs.existsSync(indexFile)) {
        const parentDir = path.dirname(fullPath)
        const newFileName = `${entry.name}.html`
        const newFilePath = path.join(parentDir, newFileName)

        fs.renameSync(indexFile, newFilePath)
      }

      const remainingEntries = fs.readdirSync(fullPath)
      if (remainingEntries.length === 0) {
        fs.rmdirSync(fullPath)
      }
    }
  }
}

try {
  flattenIndexFiles(distDir)
  console.log('✅ Directory flattening completed successfully.')
}
catch (error) {
  console.error('❌ An error occurred during directory flattening:', error)
}
