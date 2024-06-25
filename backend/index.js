const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Обработка статических файлов React
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/jobs', (req, res) => {
    console.log('Received data:', req.body);
    res.status(200).send('Form data received');
});

// Все остальные GET запросы направлять на index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
