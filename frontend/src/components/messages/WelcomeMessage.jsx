const WelcomeMessage = ({username, strangerUsername, strangerGender}) => {
    return (
        <>
            <p>
                Welcome to ... <strong>{username}</strong>!<br /><br />

                This is a safe space for <strong>adults 18+</strong> to chat anonymously with strangers. <br />
                Please be respectful—no hate, no harassment, and no sharing personal info. Treat others kindly and keep the conversation fun and positive.<br /><br /> 
                
                Enjoy your chat and remember, there’s a real person on the other side!<br /><br />

                <strong>You have been connected with: </strong>{strangerUsername}, {strangerGender}!<br />
            </p>
        </>
    );
};

export default WelcomeMessage;