import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import UserDetailsForm from "../components/UserDetailsForm";

const Welcome = () => {
	const [username, setUsername] = useState("");
	const [gender, setGender] = useState("");
	const navigate = useNavigate();

	const sendData = (e) => {
		e.preventDefault();
		try {
			socket.emit("user details", {username: username, gender: gender});
		} catch(err) {
			console.log(err);
		}
	};

	useEffect(() => {
		socket.on("matched", (data) => {
			navigate("/chat", {state: data});
		});

		return () => {
			socket.off("matched");
		};
	});

	return (
		<>
			<UserDetailsForm 
				setUserName = {setUsername}
				setGender= {setGender}
				sendData= {sendData}
			/>
		</>
	);
};

export default Welcome;