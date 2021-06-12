import express from "express"
import NotesCtrl from "./notes.controller.js"

const router = express.Router()

router.route("/").get(NotesCtrl.apiGetNotes)

export default router