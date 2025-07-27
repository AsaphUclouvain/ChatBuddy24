import { useNavigate } from "react-router-dom"

const DisconnectedMessage = ({username, gender, strangerUsername}) => {
    const navigate = useNavigate();

    const newChat = () => {
        socket.emit("user details", {username: username, gender: gender});
        return;
    }

    return (
        <p>
            {strangerUsername} has disconnected from the chat, please start a new chat <button onClick={newChat}>here</button>
        </p>
    );
};

export default DisconnectedMessage;