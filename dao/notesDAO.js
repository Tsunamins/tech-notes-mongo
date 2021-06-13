import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let notes

export default class NotesDAO {
    static async injectDB(conn) {
      if (notes) {
        return
      }
      try { 
        notes = await conn.db(process.env.TECHNOTES_NS).collection("notes")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in notesDAO: ${e}`,
        )
      }
    }

    static async getNotes({
        filters = null, 
        page = 0, 
        notesPerPage = 20, 
      } = {}) {
        let query
        
        if (filters) { 
          if ("title" in filters) {
            query = { $text: { $search: filters["title"] } }
          } else if ("description" in filters) {
            query = { "description": { $eq: filters["description"] } }
          } else if ("type" in filters) {
            query = { "type": { $eq: filters["type"] } }
          }
        }
    
        let cursor
        
        try {
          cursor = await notes
            .find(query)
        } catch (e) {
          console.error(`Unable to issue find command, ${e}`)
          return { notesList: [], totalNumNotes: 0 }
        }
    
        const displayCursor = cursor.limit(notesPerPage).skip(notesPerPage * page)
    
        try {
          const notesList = await displayCursor.toArray()
          const totalNumNotes = await notes.countDocuments(query)
    
          return { notesList, totalNumNotes }
        } catch (e) {
          console.error(
            `Unable to convert cursor to array or problem counting documents, ${e}`,
          )
          return { notesList: [], totalNumNotes: 0 }
        }
      }

      static async addNote(
          title, 
          description, 
          tech_note, 
          language, 
          technology, 
          type, 
          user_id, 
          date
        ) {
        try {
          const noteDoc = { 
              title: title,
              description: description,
              tech_note: tech_note,
              language: language,
              technology: technology,
              type: type,
              user_id: ObjectId(user_id),
              date: date,
              }
    
          return await notes.insertOne(noteDoc)
        } catch (e) {
          console.error(`Unable to post note: ${e}`)
          return { error: e }
        }
      }
    
      static async updateNote(
          note_id,
          user_id,
          title, 
          description, 
          tech_note, 
          language, 
          technology, 
          type, 
          date
      ) {
        try {
          console.log(user_id)
          const updateResponse = await notes.updateOne(
            { user_id: ObjectId(user_id), _id: ObjectId(note_id) },
            { $set: { 
              title: title, 
              description: description,
              tech_note: tech_note,
              language: language,
              technology: technology,
              type: type,
              date: date
            } },
            console.log({ user_id: user_id, _id: ObjectId(note_id) })
          )
          return updateResponse
        } catch (e) {
          console.error(`Unable to update note: ${e}`)
          return { error: e }
        }
      }
    
      static async deleteNote(note_id, user_id) {
    
        try {
          const deleteResponse = await notes.deleteOne({
            _id: ObjectId(note_id),
            user_id: user_id,
          })
    
          return deleteResponse
        } catch (e) {
          console.error(`Unable to delete note: ${e}`)
          return { error: e }
        }
      }

}