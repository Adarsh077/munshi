import axios from "axios"

const send = async (r2Path: string) => {
  await axios.post(`${process.env.API_BASE_URL}/process`, {
    r2Path,
  })
}

export default send
