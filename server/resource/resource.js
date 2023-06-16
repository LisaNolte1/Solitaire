const express = require('express');
const router = express.Router();
const { getLeaderboard, postScore } = require('./resource.database')

router.get("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await getLeaderboard();
        res.status(200).json({ leaderboard: leaderboard })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/:username/scores", async (req, res) => {
    const username = req.params.username
    const { score } = req.body
    try {
        const status = await postScore(username, score)
        res.status(200).json({ status: status })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


router.get("/:username/scores", async (req, res) => {
    const username = req.params.username
    try {
        const scores = await getUserScores(username)
        res.status(200).json({ scores: scores })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = {router};