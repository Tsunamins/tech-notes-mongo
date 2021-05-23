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


}
