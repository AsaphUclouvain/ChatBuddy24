import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WelcomeMessage from "../components/messages/WelcomeMessage";
import DisconnectedMessage from "../components/messages/DisconnectedMessage";
import "./Chat.css";
import socket from "../utils/socket";

const Chat = () => {
	const [message, setMessageValue] = useState("");
	const [messages, setMessages] = useState([]);
	const [typingIndicator, setTypingIndicator] = useState("");
	const [strangerDisconnected, setStrangerDisconnected] = useState(false);
	const messageEvents = ['chat message', 'broadcast', 'welcome message'];
	const navigate = useNavigate();
	const location = useLocation();
	const {roomId, username, gender, partnerUsername, partnerGender} = location.state || {};

	const newMessage = (e) => {
		e.preventDefault();
		if (message) {
			socket.emit('chat message', message);
			setMessageValue("");
		}
	};

	const inputChange = (e) => {
		setMessageValue(e.target.value);
		socket.emit("typing");
	};

	const addMessage = (msg) => {
		setMessages((prevMessages) => [...prevMessages, msg])
	};

	useEffect(() => {
		if (!roomId || !username || !gender || !partnerUsername || !partnerGender) {
			navigate('/');
		}

	}, [roomId, username, gender, partnerUsername, partnerGender, navigate]);

	useEffect(() => {
		messageEvents.forEach((event) => {
			socket.on(event, (msg) => {
				addMessage(msg);
			});
		});

		socket.on("userTyping", (user) => {
			setTypingIndicator("Stranger is Typing...");
			clearTimeout(window.typingTimeout);
			window.typingTimeout = setTimeout(() => {
				setTypingIndicator("");
			}, 1000);
		});

		socket.on("disconnect", () => {
			navigate("/");
		})

		socket.on("strangerDisconnected", () => {
			setStrangerDisconnected(true);
		});

		return () => {
			messageEvents.forEach(event => {
				socket.off(event);
			});
			socket.off("userTyping");
			socket.off("strangerDisconnected");
			socket.off("disconnect");
		}
	}, []);
	
	return (
		<>
			<WelcomeMessage 
				username = {username}
				strangerUsername = {partnerUsername}
				strangerGender = {partnerGender}
			/>
			<ul id="messages">
				{
					messages.map((msg, index) => (
						<li key={index}>{msg}</li>
					))
				}
			</ul>
			<form id="form" onSubmit={newMessage}>
				<div className="typingIndicator">{typingIndicator}</div>
				<input 
					id="input"
					autoComplete="off"
					disabled={strangerDisconnected}
					onChange={inputChange}
					value={message}
				/>
				<button>Send</button>
			</form>

			{strangerDisconnected && <DisconnectedMessage 
				username = {username}
				gender = {gender}
				strangerUsername = {partnerUsername}
				/>
			}
		</>
	);
};

export default Chat;