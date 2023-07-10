const express = require('express');
const app = express();
const mysql = require('mysql');
const port = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'database_condominium'
});

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
  } else {
    console.log('Connessione al database stabilita correttamente');
  }
});

app.get('/', (req, res) => {
    res.send('Pagina home');
});
  
app.get('/about', (req, res) => {
    res.send('Pagina about');
});

app.get('/users', (req, res) => {
    db.query('SELECT * FROM Condomini', (err, results) => {
      if (err) {
        console.error('Errore nella query al database:', err);
        res.status(500).send('Errore nella query al database');
      } else {
        res.send(results);
      }
    });
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});

  