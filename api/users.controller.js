import UsersDAO from "../dao/usersDAO.js"

export default class UsersController {
    static async apiGetUsers(req, res, next) {
      const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
      const page = req.query.page ? parseInt(req.query.page, 10) : 0
  
      let filters = {}
      if (req.query.username) {
        filters.username = req.query.username
      } else if (req.query.zipcode) {
        filters.username = req.query.username
      } else if (req.query.id) {
        filters.id = req.query.id
      }
  
      const { usersList, totalNumUsers } = await UsersDAO.getUsers({
        filters,
        page,
        usersPerPage,
      })
  
      let response = {
        users: usersList,
        page: page,
        filters: filters,
        entries_per_page: usersPerPage,
        total_results: totalNumUsers,
      }
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
     
      const user = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      const UserResponse = await UsersDAO.addUser(
     
        userInfo,
        user,
        date,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUser(req, res, next) {
    try {
      const userId = req.body.user_id
      const text = req.body.text
      const date = new Date()

      const userResponse = await UsersDAO.updateUser(
        userId,
        req.body.user_id,
        text,
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
      const userId = req.query.id
      const userId = req.body.user_id // he adds this as a mock authentication - not a best practice just for building
      console.log(userId)
      const userResponse = await UsersDAO.deleteUser(
        userId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}
