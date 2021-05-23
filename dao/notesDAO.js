import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let notes

export default class NotesDAO {
    static async injectDB(conn) {
      if (notes) {
        return
      }
      try { 
        users = await conn.db(process.env.TECHNOTES_NS).collection("notes")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in notesDAO: ${e}`,
        )
      }
    }



}