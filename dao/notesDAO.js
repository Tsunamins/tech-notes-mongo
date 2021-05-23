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
        filters = null, //can add this to filter, pass a filter in to trigger more of the code below for filters
        page = 0, //page specified if appl, default
        notesPerPage = 20, //get 20 at a time, default
      } = {}) {
        let query
        //these below will just depend on which filter was passed in
        if (filters) { //if type of search is requested, i.e. search by name, more on queirying in mongo check resources in vid
          if ("title" in filters) {
            query = { $text: { $search: filters["title"] } }
          } else if ("description" in filters) {
            query = { "description": { $eq: filters["description"] } }
          } else if ("note_type" in filters) {
            query = { "note_type": { $eq: filters["note_type"] } }
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

}