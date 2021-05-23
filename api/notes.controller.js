import NotesDAO from "../dao/notesDAO.js"

export default class NotesController {
    static async apiGetNsers(req, res, next) {
        const notesPerPage = req.query.notesPerPage ? parseInt(req.query.notesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
    
        let filters = {}
        if (req.query.title) {
          filters.title = req.query.title
        } else if (req.query.description) {
          filters.description = req.query.description
        } else if (req.query.id) {
          filters.id = req.query.id
        }
    
        const { notesList, totalNumNotes } = await NotesDAO.getNotes({
          filters,
          page,
          notesPerPage,
        })
    
        let response = {
          notes: notesList,
          page: page,
          filters: filters,
          entries_per_page: notesPerPage,
          total_results: totalNumUsers,
        }
        res.json(response)
      }
      
  static async apiPostNote(req, res, next) {
    try {
     
      const note = req.body.text
      const noteInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      const NoteResponse = await NotesDAO.addNote(
     
        userInfo,
        note,
        date,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateNote(req, res, next) {
    try {
      const noteId = req.body.note_id
      const text = req.body.text
      const date = new Date()

      const noteResponse = await NotesDAO.updateNote(
        noteId,
        req.body.user_id,
        text,
        date,
      )

      var { error } = noteResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (noteResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update note - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteNote(req, res, next) {
    try {
      const noteId = req.query.id
      const userId = req.body.user_id // he adds this as a mock authentication - not a best practice just for building
      console.log(noteId)
      const noteResponse = await NotesDAO.deleteNote(
        noteId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}