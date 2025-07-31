import socket from "../../utils/socket";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DisconnectedMessage = ({self, username, gender, strangerUsername, reInitState}) => {
    const [connecting, setConnecting] = useState(false);
    const navigate = useNavigate();

    const newChat = () => {
        setConnecting(true);
        socket.emit("user details", {
            username: username,
            gender: gender
        });

        socket.once("matched", (data) => {
            reInitState();
            navigate("/chat", { state: data });
        });
    };

    if (!self) {
        return (
            <p>
                {strangerUsername} has disconnected from the chat, please start a new chat {!connecting && <button onClick={newChat}>here</button>}
                {connecting && <p><strong>Connecting to Stranger...</strong></p>}
            </p>
        );
    } else {
        return (
            <p>
                You have been disconnected from the chat, please start a new chat {!connecting && <button onClick={newChat}>here</button>}
                {connecting && <p><strong>Connecting to Stranger...</strong></p>}
            </p>
        )
    };
};

export default DisconnectedMessage;