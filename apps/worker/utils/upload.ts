import axios from "axios"
import { File } from "../enum.js"

const upload = async (file: File): Promise<string | null> => {
  try {
    const signedUrl = await axios.post(
      `${process.env.API_BASE_URL}/presigned-url`,
      {
        filename: file.name,
        contentType: Bun.file(file.path).type,
      }
    )
    if (signedUrl.data?.body?.url) {
      const f = Bun.file(file.path)

      const res = await fetch(signedUrl.data?.body?.url, {
        method: "PUT",
        body: f,
        headers: { "Content-Type": f.type },
      })
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${await res.text()}`)
      }

      return signedUrl.data?.body?.path
    }

    return null
  } catch (err) {
    console.log(err)
    return null
  }
}

export default upload
