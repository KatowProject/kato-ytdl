/* Module */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

/* ====== */
const app = express();
const PORT = process.env.PORT || 3000;
const ytdl = require('./router/ytdl.js');

app.use(cors());
app.use(helmet());
app.use("/api", ytdl);
app.use(express.static('./public'));

app.use('/api', (req, res) => {
    res.send({name: "kato-ytdl", description: "youtube video downloader"});
});

app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "api path not found",
    });
});


/* Listener */
app.listen(PORT, () => {
    console.log('Listening on PORT ' + PORT);
})
