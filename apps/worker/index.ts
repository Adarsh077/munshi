import send from "./utils/send.js"
import upload from "./utils/upload.js"
import watch from "./utils/watch.js"

for await (const file of watch()) {
  console.log(`${file.name} uploading...`)
  const r2Path = await upload(file)
  if (!r2Path) continue
  console.log(`${file.name} processing...`)
  send(r2Path)
}
