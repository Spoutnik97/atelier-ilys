import sharp from 'sharp'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs'

const files = await glob('src/assets/**/*.{jpg,jpeg,png,webp}')

for (const file of files) {
  const ext = path.extname(file).toLowerCase()
  const outDir = path.dirname(file).replace('src/assets', 'src/assets/optimized')
  fs.mkdirSync(outDir, { recursive: true })
  const out = path.join(outDir, path.basename(file))

  const before = fs.statSync(file).size
  
  if (ext === '.png') {
    await sharp(file).png({ quality: 80 }).toFile(out)
  } else {
    await sharp(file).jpeg({ quality: 80, mozjpeg: true }).toFile(out)
  }

  const after = fs.statSync(out).size
  const ratio = Math.round((1 - after/before) * 100)
  console.log(`${path.basename(file)}: ${ratio}% smaller`)
}