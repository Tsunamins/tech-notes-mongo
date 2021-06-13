import express from "express"
import UsersController from "./users.controller.js" 
import NotesCtrl from "./notes.controller.js"

const router = express.Router()

router.route("/").get(UsersController.apiGetUsers)
      .post(UsersController.apiPostUser)
      .put(UsersController.apiUpdateUser)
      .delete(UsersController.apiDeleteUser)

router.route("/id/:id").get(UsersController.apiGetUserById)



router
  .route("/note")
  .post(NotesCtrl.apiPostNote)
  .put(NotesCtrl.apiUpdateNote)
  .delete(NotesCtrl.apiDeleteNote)

export default router