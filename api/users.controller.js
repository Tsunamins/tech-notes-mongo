import UsersDAO from "../dao/usersDAO.js"

export default class UsersController {
    static async apiGetUsers(req, res, next) {

      const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
      const page = req.query.page ? parseInt(req.query.page, 10) : 0
  
      let filters = {}
      if (req.query.username) {
        filters.username = req.query.username
      } else if (req.query.email) {
        filters.email = req.query.email
      } else if (req.query.favorite_tech) {
        filters.id = req.query.favorite_tech
      }
  
      const { usersList, totalNumUsers } = await UsersDAO.getUsers({
        filters,
        page,
        usersPerPage,
      })
      console.log(req)
  
      let response = {
        users: usersList,
        page: page,
        filters: filters,
        entries_per_page: usersPerPage,
        total_results: totalNumUsers,
      }
      console.log(res)
      res.json(response)
    }

  static async apiGetUserById(req, res, next) {
    try {
      let id = req.params.id || {}
      let user = await UsersDAO.getUserByID(id)
      if (!user) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(user)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostUser(req, res, next) {
    try {
     
      const username = req.body.username
      const email = req.body.email
      const password = req.body.password
      const favorite_tech = req.body.favorite_tech
      const date = new Date()

      const UserResponse = await UsersDAO.addUser(
     
        username,
        email,
        password,
        favorite_tech,
        date,
      )

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUser(req, res, next) {
    try {
      const username = req.body.username
      const email = req.body.email
      const favorite_tech = req.body.favorite_tech
      const date = new Date()

      const userResponse = await UsersDAO.updateUser(
        req.body.user_id,
        username,
        email,
        favorite_tech,
        date,
      )

      var { error } = userResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (userResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update user - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteUser(req, res, next) {
    try {
      const user_id = req.query.id
      console.log(userId)
      const userResponse = await UsersDAO.deleteUser(
        
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}
