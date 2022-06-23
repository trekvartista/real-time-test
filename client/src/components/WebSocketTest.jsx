import { useEffect, useRef, useState } from "react";
import axios from "axios";

const WebSocketTest = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);

    const socket = useRef();
    const [isConnected, setIsConnected] = useState(false);
    const [username, setUsername] = useState("");

    const sendMessage = async () => {
        if (value) {
            const message = {
				event: 'message',
				username,
				message: value,
				id: Date.now()
			}
			socket.current.send(JSON.stringify(message))
			setValue("")	
        }
    };

    const connectUser = () => {
        setTimeout(() => {
            socket.current = new WebSocket("ws://localhost:5000");

            socket.current.onopen = () => {
                setIsConnected(true);
                const message = {
                    event: "connection",
                    username: username,
                    id: Date.now(),
                };
                socket.current.send(JSON.stringify(message));

                console.log("Connection is established");
            };

            socket.current.onmessage = (event) => {
                const message = JSON.parse(event.data);

                setMessages((prev) => [message, ...prev]);
            };

            socket.current.onclose = () => {
                console.log("Websocket is closed");
            };

            socket.current.onerror = () => {
                console.log("Websocket: an error occured");
            };
        }, 500);
    };

    if (!isConnected) {
        return (
            <div className="py-20">
                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                    <input
                        value={username}
                        placeholder="Enter username..."
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                    />
                    <button className="button" onClick={() => connectUser()}>
                        Enter
                    </button>
                </div>
            </div>
        );
    }

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
                    <button className="button" onClick={() => sendMessage()}>
                        Send
                    </button>
                </div>

                <div className="messages">
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.event === "connection" ? (
                                <div className="text-sm p-1">
                                    {" "}
                                    <b>{msg.username}</b> joined the chat{" "}
                                </div>
                            ) : (
                                <div className="flex flex-col justify-between message">
                                    <span className="text-sm text-blue-700 font-semibold">{msg.username}</span>
									<span>{msg.message}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebSocketTest;
