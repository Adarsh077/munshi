import fs from "node:fs/promises"
import { execFile as execFileSync } from "node:child_process"
import { promisify } from "node:util"
import path from "node:path"
import { DateTime } from "luxon"
import config from "./config.js"
import { File } from "../enum.js"

const PATH = config.dir || "/home/adarshs/Videos/obs"
const execFile = promisify(execFileSync)

type ProbeResult = {
  format: { duration: string; format_name: string; size: string }
  streams: { codec_type: "video" | "audio"; codec_name: string }[]
}

const probe = async (path: string): Promise<ProbeResult | null> => {
  try {
    const { stdout } = await execFile("ffprobe", [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      path,
    ])

    return JSON.parse(stdout) as ProbeResult
  } catch (err) {
    return null
  }
}

const getFileDetails = async (
  folder: string,
  name: string
): Promise<File | null> => {
  try {
    const fullPath = path.join(folder, name)
    const fileStat = await fs.stat(fullPath)
    if (!fileStat.isFile()) return null
    await probe(fullPath)

    return {
      isComplete: false,
      name,
      path: fullPath,
      ctime: fileStat.birthtime,
      mtime: fileStat.mtime,
      size: fileStat.size,
    }
  } catch (err) {
    return null
  }
}

const files: File[] = []

const listen = async () => {
  for await (const event of fs.watch(PATH)) {
    if (!event.filename) continue
    const file = await getFileDetails(PATH, event.filename)
    if (!file) continue
    file.mtime = DateTime.now().toJSDate()

    const fileIdx = files.findIndex((f) => f.path === file.path)
    if (fileIdx !== -1 && files[fileIdx]) {
      files[fileIdx] = file
    } else {
      files.push(file)
    }
  }
}

async function* watch(): AsyncGenerator<File> {
  listen()
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newFiles = files.filter((file) => {
      const mtime = DateTime.fromJSDate(file.mtime)
      return DateTime.now().diff(mtime).as("second") > 10
    })
    for (const file of newFiles) {
      files.splice(
        files.findIndex((f) => f.path === file.path),
        1
      )
      yield file
    }
  }
}

export default watch
