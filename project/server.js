const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 3001;

const db = mysql.createConnection({
  host: 'localhost',
  port: '3307',
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
    res.sendFile('/Users/francescozoni/Documents/UniPR/Tecnologie Internet/Project-Condominium/project/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile('/Users/francescozoni/Documents/UniPR/Tecnologie Internet/Project-Condominium/project/login.html');
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

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Query per il controllo delle credenziali nel database
  const query = "SELECT * FROM Condomini WHERE email = "+username+" AND password = "+password;
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Errore del server');
    } else if (results.length === 0) {
      res.status(401).send('Credenziali non valide');
    } else {
      res.status(200).send('Login effettuato con successo');
    }
  });
});