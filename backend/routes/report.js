const express = require("express");
const connectDB = require("../utils/db_connect");
const router = express.Router();

router.post("/report", async (req, res) => {
    try {
        const db = await connectDB();
        const {
            reporterUsername,
            reporterIp,
            reportedUsername,
            reportedIP,
            reason,
            messages
        } = req.body;

        const reportId = await db.incr('report:id');
        await db.hSet(`report:${reportId}`, {
            createdAt: String(Date.now()),
            reporterUsername: reporterUsername,
            reporterIp: reporterIp,
            reportedUsername: reportedUsername,
            reportedIP: reportedIP,
            reason: reason,
            messages: JSON.stringify(messages)
        });

        await db.sAdd('reports', String(reportId));
        res.status(201).json({message: "Report Created successfully"});
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;