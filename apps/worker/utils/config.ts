import { parseArgs } from "node:util"

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    api: { type: "string", short: "a" },
    dir: { type: "string", short: "d" },
  },
})

if (process.env.NODE_ENV === "development") {
  values.api = process.env.API_BASE_URL
  values.dir = process.env.DIR
}

export default values
