import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import UserDetailsForm from "../components/UserDetailsForm";

const Welcome = () => {
	const [userName, setUserName] = useState("");
	const [gender, setGender] = useState("");
	const navigate = useNavigate();

	const sendData = (e) => {
		e.preventDefault();
		try {
			socket.emit("user details", {username: userName, gender: gender});
		} catch(err) {
			console.log(err);
		}
	};

	useEffect(() => {
		socket.on("matched", () => {
			navigate("/chat");
		});

		return () => {
			socket.off("matched");
		};
	});

	return (
		<>
			<UserDetailsForm 
				setUserName = {setUserName}
				setGender= {setGender}
				sendData= {sendData}
			/>
		</>
	);
};

export default Welcome;