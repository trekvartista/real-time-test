import { useEffect, useState } from "react";
import axios from "axios";

const LongPolling = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);

    const subscribe = async () => {
        try {
            const { data } = await axios.get(
                "http://localhost:5000/get-messages"
            );
            console.log(data);
            setMessages((prev) => [data, ...prev]);
            await subscribe();
        } catch (e) {
            console.log(e);
            setTimeout(() => {
                subscribe();
            }, 500);
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
        subscribe();
    }, []);

    return (
        <div className="p-20 ">
            <div className="flex mx-auto flex-col items-center max-w-xs">
                <div className="flex flex-col gap-4 min-w-full">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="p-4 rounded-md outline outline-2 outline-violet-500 focus:outline-[3px] focus:outline-violet-800"
                    />
                    <button
                        className="p-1 text-lg font-semibold rounded-md bg-teal-100"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>

                <div className="flex flex-col min-w-full border-2 border-gray-500 p-3 gap-3 mt-12 rounded-xl">
                    {messages.map((msg) => (
                        <div
                            className="p-1 rounded-md bg-teal-100"
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

export default LongPolling;
