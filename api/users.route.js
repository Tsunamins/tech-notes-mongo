import express from "express"
import UsersController from "./users.controller.js" 
import NotesCtrl from "./notes.controller.js"

const router = express.Router()

router.route("/").get(UsersController.apiGetUsers)
      .post(UsersController.apiPostUser)

router
  .route("/note")
  .post(NotesCtrl.apiPostNote)
  .put(NotesCtrl.apiUpdateNote)
  .delete(NotesCtrl.apiDeleteNote)

export default router