import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!
  }
})

export async function uploadToR2(filePath: string, filename: string) {
  const fileContent = fs.readFileSync(filePath)

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: filename,
    Body: fileContent,
    ContentType: 'application/xml',
    ACL: 'public-read'
  })

  try {
    await r2.send(command)
    console.log(`✅ Uploaded: https://${process.env.R2_BUCKET}.${process.env.R2_ENDPOINT?.replace('https://', '')}/${filename}`)
  } catch (err) {
    console.error('❌ Upload failed:', err)
  }
}