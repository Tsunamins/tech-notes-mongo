import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let users 

export default class UsersDAO {
    static async injectDB(conn) {
      if (users) {
        return
      }
      try { 
        users = await conn.db(process.env.TECHNOTES_NS).collection("users")
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in usersDAO: ${e}`,
        )
      }
    }



}
