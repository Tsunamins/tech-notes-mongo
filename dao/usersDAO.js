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

    static async getUsers({
        filters = null, 
        page = 0,
        usersPerPage = 20, 
      } = {}) {
        let query

        if (filters) { 
          if ("username" in filters) {
            query = { $text: { $search: filters["username"] } }
          } else if ("email" in filters) {
            query = { "email": { $eq: filters["email"] } }
          } else if ("favorite_tech" in filters) {
            query = { "favorite_tech": { $eq: filters["favorite_tech"] } }
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

    static async getUserByID(id) {
            try {
              const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                      {
                          $lookup: {
                              from: "notes",
                              let: {
                                  id: "$_id",
                              },
                              pipeline: [
                                  {
                                      $match: {
                                          $expr: {
                                              $eq: ["$user_id", "$$id"],
                                          },
                                      },
                                  },
                                  {
                                      $sort: {
                                          date: -1,
                                      },
                                  },
                              ],
                              as: "notes",
                          },
                      },
                      {
                          $addFields: {
                              notes: "$notes",
                          },
                      },
                  ]
              return await users.aggregate(pipeline).next()
            } catch (e) {
              console.error(`Something went wrong in getUserByID: ${e}`)
              throw e
            }
          }

          static async addUser(username, email, password, favorite_tech, date) {
            try {
              const userDoc = { 
                  username: username,
                  email: email,
                  password: password,
                  favorite_tech: favorite_tech,
                  date: date,
                  
              }
        
              return await users.insertOne(userDoc)
            } catch (e) {
              console.error(`Unable to post user: ${e}`)
              return { error: e }
            }
          }
        
          static async updateUser(user_id, username, email, favorite_tech, date) {
            try {
              const updateResponse = await users.updateOne(
                {_id: ObjectId(user_id)},
                { $set: { username: username, email: email, favorite_tech: favorite_tech, date: date  } },
              )
        
              return updateResponse
            } catch (e) {
              console.error(`Unable to update user: ${e}`)
              return { error: e }
            }
          }
        
          static async deleteUser(user_id) {
        
            try {
              const deleteResponse = await users.deleteOne({
                _id: ObjectId(user_id),
                
              })
        
              return deleteResponse
            } catch (e) {
              console.error(`Unable to delete user: ${e}`)
              return { error: e }
            }
          }

}

