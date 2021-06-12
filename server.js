import express from "express"
import cors from "cors"
import notes from "./api/notes.route.js"
import users from "./api/users.route.js"

const app = express()
app.use(cors())
app.use(express.json())

//specify routes
app.use("/api/v1/notes", notes)
app.use("/api/v1/users", users)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app