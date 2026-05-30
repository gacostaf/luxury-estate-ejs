import * as fs from 'fs'
import * as path from 'path'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0')
}

function timestamp(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1, 2)
  const day = pad(d.getDate(), 2)
  const hours = pad(d.getHours(), 2)
  const minutes = pad(d.getMinutes(), 2)
  const seconds = pad(d.getSeconds(), 2)
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function getShardDir(propertyId: number): string {
  return pad(propertyId, 6)
}

export function getFileName(propertyId: number, ts: string, consecutive: number, ext: string): string {
  const extNormalized = ext.startsWith('.') ? ext : `.${ext}`
  return `${pad(propertyId, 6)}${ts}${pad(consecutive, 3)}${extNormalized}`
}

function getRelativePath(propertyId: number, ts: string, consecutive: number, ext: string): string {
  const shard = getShardDir(propertyId)
  const name = getFileName(propertyId, ts, consecutive, ext)
  return `/images/${shard}/${name}`
}

function getAbsolutePath(propertyId: number, ts: string, consecutive: number, ext: string): string {
  const shard = getShardDir(propertyId)
  const name = getFileName(propertyId, ts, consecutive, ext)
  return path.join(IMAGES_DIR, shard, name)
}

function ensureShardDir(propertyId: number): string {
  const dir = path.join(IMAGES_DIR, getShardDir(propertyId))
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function saveImageFile(
  propertyId: number,
  ts: string,
  consecutive: number,
  ext: string,
  buffer: Buffer,
): string {
  ensureShardDir(propertyId)
  const destPath = getAbsolutePath(propertyId, ts, consecutive, ext)
  fs.writeFileSync(destPath, buffer)
  return getRelativePath(propertyId, ts, consecutive, ext)
}

export { timestamp }
