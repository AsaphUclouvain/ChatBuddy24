import { useState, useEffect } from "react";
import "./Chat.css";
import socket from "../utils/socket";

const Chat = () => {
	const [message, setMessageValue] = useState("");
	const [messages, setMessages] = useState([]);
	const [typingIndicator, setTypingIndicator] = useState("");

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
		socket.on("chat message", (msg) => {
			addMessage(msg);
		});

		socket.on("userTyping", (user) => {
			setTypingIndicator("Stranger is Typing...");
			clearTimeout(window.typingTimeout);
			window.typingTimeout = setTimeout(() => {
				setTypingIndicator("");
			}, 1000);
		});

		return () => {
			socket.off("chat message");
			socket.off("userTyping");
		}
	}, []);
	
	return (
		<>
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
					onChange={inputChange}
					value={message}
				/>
				<button>Send</button>
			</form>
		</>
	);
};

export default Chat;