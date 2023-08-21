const express = require('express');
const app = express();
const mysql = require('mysql2');
const port = 3001;
const directory = '/Users/francescozoni/Documents/UniPR/Tecnologie Internet/Project-Condominium/project';

app.use(express.urlencoded({ extended: true })); // Configura il middleware per il parsing dei dati del form

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

// Middleware per l'analisi del corpo della richiesta come JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pagina home');
});
  
app.get('/home', (req, res) => {
    res.sendFile(directory+'/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(directory+'/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(directory+'/registration.html');
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


app.post('/registration', (req, res) => {
  const { nome, cognome, indirizzo, telefono, email, password } = req.body;

    // Esegui la query per inserire il nuovo utente nella tabella "Condomini"
    const insertQuery = `INSERT INTO Condomini (nome, cognome, indirizzo, telefono, email, password) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(insertQuery, [nome, cognome, indirizzo, telefono, email, password], (err, result) => {
        if (err) {
            console.error("Errore durante l'inserimento dell'utente:", err);
            return res.status(500).send("Errore durante la registrazione dell'utente.");
        }

        console.log("Nuovo utente inserito con successo.");
        res.send("Registrazione completata con successo.");
    });

});