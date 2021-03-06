import NotesDAO from "../dao/notesDAO.js"

export default class NotesController {
    static async apiGetNotes(req, res, next) {
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
          total_results: totalNumNotes,
        }
        res.json(response)
      }
      
  static async apiPostNote(req, res, next) {
    try {
      
      const title = req.body.title
      const description = req.body.description
      const tech_note = req.body.tech_note
      const language = req.body.language
      const technology = req.body.technology
      const type = req.body.type
      const user_id = req.body.user_id
      const date = new Date()
      

      const NoteResponse = await NotesDAO.addNote(
        title,
        description,
        tech_note,
        language,
        technology,
        type,
        user_id,
        date,
      )
      
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateNote(req, res, next) {
    try {
      //note that will need to get the current user and current note id
      //note that will need to pass along existing fields even if they aren't changing or specify items to be passed into set, i.e. if they are null don't set them
      const note_id = req.body.note_id
      const title = req.body.title
      const description = req.body.description
      const tech_note = req.body.tech_note
      const language = req.body.language
      const technology = req.body.technology
      const type = req.body.type
      const date = new Date()
      console.log(note_id)

      const noteResponse = await NotesDAO.updateNote(
        note_id,
        req.body.user_id,
        title,
        description,
        tech_note,
        language,
        technology,
        type,
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
      const note_id = req.query.id
      const user_id = req.body.user_id // he adds this as a mock authentication - not a best practice just for building
      console.log(noteId)
      const noteResponse = await NotesDAO.deleteNote(
        note_id,
        user_id,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}