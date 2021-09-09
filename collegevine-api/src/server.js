const app = require('./app');

const { PORT, DB_URL } = require('./config');

app.get('/', (req, res) => {
  res.json('hi');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
