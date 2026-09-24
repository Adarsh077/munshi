import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
})

export const getPresignedUrl = async (
  filename: string,
  contentType: string
) => {
  const path = `recordings/${filename}`
  const putUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: path,
      ContentType: contentType,
    }),
    { expiresIn: 3600 }
  )

  return { putUrl, path }
}
