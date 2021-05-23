import express from "express"
import UsersCtrl from "./users.controller.js" 
import NotesCtrl from "./notes.controller.js"

const router = express.Router()

router.route("/").get(UsersCtrl.apiGetUsers)