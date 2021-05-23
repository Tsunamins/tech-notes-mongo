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

    // add a general get users, update later
    static async getUsers({
        filters = null, 
        page = 0,
        usersPerPage = 20, 
      } = {}) {

        let query

        if (filters) { 
          if ("name" in filters) {
            query = { $text: { $search: filters["username"] } }
          } else if ("email" in filters) {
            query = { "email": { $eq: filters["email"] } }
          } else if ("id" in filters) {
            query = { "id": { $eq: filters["id"] } }
          }
        }

        let cursor

        try {
            cursor = await users
              .find(query)
          } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { usersList: [], totalNumUsers: 0 }
          }

          const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

          try {
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await users.countDocuments(query)
      
            return { usersList, totalNumUsers }
          } catch (e) {
            console.error(
              `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { usersList: [], totalNumUsers: 0 }
          }
        }

        

}

