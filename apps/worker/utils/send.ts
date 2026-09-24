import axios from "axios"
import config from "./config.js"

const send = async (r2Path: string) => {
  await axios.post(`${config.api}/process`, {
    r2Path,
  })
}

export default send
