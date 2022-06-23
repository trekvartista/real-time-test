import { useEffect, useState } from "react";
import axios from "axios";

const EventSourcing = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect')
		eventSource.onmessage = function (event) {
			// console.log(event.data)

			const msg = JSON.parse(event.data)
			setMessages(prev => [msg, ...prev]) 
		}
    };

    const sendMessage = async () => {
        if (value) {
            await axios.post("http://localhost:5000/new-messages", {
                message: value,
                id: Date.now(),
            });
        }
    };

    useEffect(() => {
		console.log('i fire once!')
        subscribe();
    }, []);

    return (
        <div className="p-20 ">
            <div className="flex mx-auto flex-col items-center max-w-xs">
                <div className="flex flex-col gap-4 min-w-full">
                    <input
						placeholder="Enter message..."
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="input"
                    />
                    <button
                        className="button"
                        onClick={() => sendMessage()}
                    >
                        Send
                    </button>
                </div>

                <div className="messages">
                    {messages.map((msg) => (
                        <div
                            className="message"
                            key={msg.id}
                        >
                            {msg.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventSourcing;
