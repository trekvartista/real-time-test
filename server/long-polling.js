const express = require('express');
const cors = require('cors');
const events = require('events')
const PORT = 5000;

const emitter = new events.EventEmitter();
// emitter.setMaxListeners(20)

const app = express()

app.use(cors())
app.use(express.json())

app.get('/get-messages', (req, res) => {

    emitter.once('newMessage', (msg) => {
        res.json(msg)
    })
})

app.post('/new-messages', ((req, res) => {
    const msg = req.body;
    emitter.emit('newMessage', msg)
    res.status(200)
}))


app.listen(PORT, () => console.log("server started on port", PORT))
