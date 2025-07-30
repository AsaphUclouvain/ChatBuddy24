const report = async (reporterUsername, reporterIp, reportedUsername, reportedIP, reason, messages) => {
    const url = "http://localhost:3001/tts/chats/report";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                reporterUsername,
                reporterIp,
                reportedUsername,
                reportedIP,
                reason,
                messages
            }),
            credentials: "include"
        });

        if (!response) {
            throw new Error(`status: ${response.status}`);
        };

        const json = await response.json();
        return json;
        
    } catch(err) {
        console.log(err);
    };
};

export default report;