import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import UsersDAO from "./dao/usersDAO.js"
import NotesDAO from "./dao/notesDAO.js"
dotenv.config()

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.TECHNOTES_DB_URI,
    {
        useUnifiedTopology: true,
        poolSize: 50,
        useNewUrlParser: true,
        writeConcern: {
            wtimeout: 2500,
        },

    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await UsersDAO.injectDB(client)
    await NotesDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})