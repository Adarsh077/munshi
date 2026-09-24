import server from "./src/server.js"

server.listen(5000, (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log("processor running on 5000...")
  }
})
