const express = require('express')
const cors = require('cors')
const multer = require('multer')
const nanoid = require('nanoid')
const path = require('path')
const fs = require('fs/promises')

const app = express()

app.use(cors())
app.use(express.json)


const tempDir = path.join(__dirname, "temp")

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname)

    }
})

const upload = multer({
    storage: multerConfig
})

const contacts = []

app.get("/api/contacts", (req, res) => {
    res.json(
        contacts
    )
})

const contactsDir = path.join(__dirname, "publik", "contacts")

app.post("/api/contacts", upload.single("cover"), async (req, res) => {
    const { path: tempUpload, originalName } = req.file
    const resultUpload = path.join(contactsDir, originalName)
    await fs.rename(tempUpload, resultUpload)
    const cover = path.join("public", "contacts", originalName)
    const newContacts = {
        id: nanoid(),
        ...req.body,
        cover,

    }
    contacts.push(newContacts)
    res.status(201).json(newContacts)
    console.log(req.body)
    console.log(req.file)

})

module.exports = app
