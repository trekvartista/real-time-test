const ws = require('ws')
const PORT = 5000

const wss = new ws.Server({
	port: PORT
}, () => console.log("server started on port", PORT))

wss.on('connection', (ws) => {
	ws.on('message', (message) => {
		message = JSON.parse(message)
	
		switch(message.event) {
			case 'message':
				// ws.send()	this will send a msg to yourself (clients are websockets)
				broadcast(message)
			    break
			case 'connection':
				broadcast(message)
				break
		}
	})
})

const sampleMsg = {
	event: 'message/connection',
	id: 1,
	date: Date.now(),
	username: 'johnny',
	message: 'Test message'
}

const broadcast = (message) => {
	wss.clients.forEach(client => {
		client.send(JSON.stringify(message))
	})
}