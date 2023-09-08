const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2');
const port = 3002;
const directory = '/Users/francescozoni/Documents/UniPR/Tecnologie Internet/Project_Condominium/Project_Condominium';

app.use(express.urlencoded({ extended: true })); // Configura il middleware per il parsing dei dati del form
app.use(express.json());

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
  
app.get('/home', (req, res) => {
    res.sendFile(directory+'/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(directory+'/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(directory+'/registration.html');
});

app.get('/condominium-fee-payments', (req, res) => {
  res.sendFile(directory+'/condominium-fee-payments.html');
});

app.get('/budget-previous-years', (req, res) => {
  res.sendFile(directory+'/budget-previous-years.html');
});

app.get('/family', (req, res) => {
  res.sendFile(directory+'/family.html');
});

app.get('/future-projects', (req, res) => {
  res.sendFile(directory+'/future-projects.html');
});

app.get('/notifications', (req, res) => {
  res.sendFile(directory+'/notifications.html');
});

app.get('/reunions', (req, res) => {
  res.sendFile(directory+'/reunions.html');
});

app.get('/verbals', (req, res) => {
  res.sendFile(directory+'/verbals.html');
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});

// IL LOGIN DEVE ESSERE EFFETTUATO TRAMITE LA MAIL E LA PASSWORD E IL COD. PERSONALE / COD. CONDOMINIO
app.post('/login', (req, res) => {
  const { email, password, codice } = req.body;

  // Query per il controllo delle credenziali nel database
  const query = "SELECT * FROM Utente WHERE email = ? AND password = ? AND ";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Errore del server');
    } else if (results.length === 0) {
        res.status(401).send('Credenziali non valide. Verifica email e password.');
      } else {
        const user = results[0];
        if (user.ruolo === "Utente" && user.codice === codice) {
          res.sendFile(directory + '/index-user.html');
        } else if (ruolo === "Amministratore" && user.codicePersonale === codicePersonale) {
          res.sendFile(directory + '/index.html');
        } else {
          // Gestisci altri casi di ruolo se necessario
          res.status(403).send('Accesso non autorizzato');
        }
      }
    });
  });



app.post('/registration', (req, res) => {
  const { nome, cognome, email, password, p_iva, ruolo } = req.body;

  // Controllo se l'email esiste già nel database
  const controlloMail = 'SELECT * FROM Utente WHERE email = ?';
  db.query(controlloMail, [email], (controlloErr, controlloRes) => {
    if (controlloErr) {
      console.error("Errore durante il controllo dell'email:", controlloErr);
      return res.status(500).send("Errore durante la registrazione dell'utente.");
    }

    if (controlloRes.length > 0) {
      // L'email esiste già nel database
      return res.status(400).send("L'indirizzo email è già registrato.");
    }

    // // Esegui l'hashing della password
    // bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    //   if (hashErr) {
    //     console.error("Errore durante l'hashing della password:", hashErr);
    //     return res.status(500).send("Errore durante la registrazione dell'utente.");
    //   }

      // Esegui la query per inserire il nuovo utente nella tabella "Condominio"
      const insertQuery = `INSERT INTO Utente (nome, cognome, email, password, p_iva, ruolo) VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [nome, cognome, email, password, p_iva, ruolo], (err, result) => {
        if (err) {
            console.error("Errore durante l'inserimento dell'utente:", err);
            return res.status(500).send("Errore durante la registrazione dell'utente.");
        }

        console.log("Nuovo utente inserito con successo.");
        res.sendFile(directory+'/login.html');
      });
    // });
  });
});

app.post('/insert_payment', (req, res) => {
  const { data, descrizione, mittente, codice_identificativo, prezzo } = req.body;
  const insertQuery = 'INSERT INTO Pagamento (descrizione, importo, data, condominio_id) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [data,descrizione,mittente,codice_identificativo,prezzo], (err, result) => {
    if (err) {
      console.error("Errore durante l'inserimento del pagamento", err);
      return res.status(500).send("Errore durante l'inserimento del pagamento");
    }

  console.log("Nuovo pagamento inserito con successo.");
  });
});

app.post('/aggiorna-pagamento', (req, res) => {
  const { idPagamento, data, descrizione, codiceIdentificativo, importo } = req.body;

  // Esegui la query SQL per aggiornare il pagamento nel database
  const updateQuery = `
    UPDATE Pagamenti
    SET data = ?, descrizione = ?, codice_identificativo = ?, importo = ?
    WHERE id = ?;
  `;

  db.query(updateQuery, [data, descrizione, codiceIdentificativo, importo, idPagamento], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Errore del server durante l\'aggiornamento del pagamento');
    } else {
      // Aggiornamento riuscito
      res.status(200).send('Pagamento aggiornato con successo');
    }
  });
});


app.get('/condominio', (req, res) => {
  const query = 'SELECT * FROM Condominio';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});