import express, { type Express, Request, Response } from "express"
import { getPresignedUrl } from "./services/s3.service.js"

const server: Express = express()

server.use(express.json())

server.get("/status", (req: Request, res: Response) => {
  res.send("working")
})

server.post("/presigned-url", async (req: Request, res: Response) => {
  const { filename, contentType } = req.body

  const { putUrl, path } = await getPresignedUrl(filename, contentType)

  res.json({ status: "success", body: { url: putUrl, path } })
})

server.post("/process", (req: Request, res: Response) => {
  const { r2Path } = req.body
  console.log(r2Path)
  res.json({ status: "success" })
})

export default server
