const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2');
const port = 3002;
const directory = '/Users/francescozoni/Documents/UniPR/Tecnologie Internet/Project-Condominium';

app.use(express.urlencoded({ extended: true })); // Configura il middleware per il parsing dei dati del form
app.use(express.json());


// Endpoint API per ottenere i dettagli dei condomini
app.get('/api/condominii', (req, res) => {
  res.json(condominiData);
});

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
  res.sendFile(directory + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(directory + '/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(directory + '/registration.html');
});

app.get('/condominium-fee-payments', (req, res) => {
  res.sendFile(directory + '/condominium-fee-payments.html');
});

app.get('/budget-previous-years', (req, res) => {
  res.sendFile(directory + '/budget-previous-years.html');
});

app.get('/family', (req, res) => {
  res.sendFile(directory + '/family.html');
});

app.get('/future-projects', (req, res) => {
  res.sendFile(directory + '/future-projects.html');
});

app.get('/notifications', (req, res) => {
  res.sendFile(directory + '/notifications.html');
});

app.get('/reunions', (req, res) => {
  res.sendFile(directory + '/reunions.html');
});

app.get('/verbals', (req, res) => {
  res.sendFile(directory + '/verbals.html');
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Effettua una query per ottenere la riga dell'utente basata sull'email
  const selectQuery = 'SELECT * FROM Utente WHERE email = ?';
  db.query(selectQuery, [email], (err, results) => {
    if (err) {
      console.error("Errore durante il login:", err);
      return res.status(500).send("Errore durante il login.");
    }

    if (results.length === 0) {
      // L'utente non esiste nel database
      return res.status(401).send("Credenziali non valide.");
    }

    // Verifica la password hashata
    const user = results[0];
    bcrypt.compare(password, user.password, (hashErr, isMatch) => {
      if (hashErr) {
        console.error("Errore durante la verifica della password:", hashErr);
        return res.status(500).send("Errore durante il login.");
      }

      if (!isMatch) {
        // La password non corrisponde
        return res.status(401).send("Credenziali non valide.");
      }

      // Creazione del token JWT per l'utente autenticato
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

      // Puoi restituire il token come risposta o eseguire altre azioni dopo il login
      // res.send({ token }); // Modifica di conseguenza la risposta in base alle tue esigenze

      if (user.ruolo === "Utente") {
        res.sendFile(directory + '/index-user.html');
      }
      else {
        res.sendFile(directory + '/index.html');
      }
    });
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

    // Esegui l'hashing della password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Errore durante l'hashing della password:", hashErr);
        return res.status(500).send("Errore durante la registrazione dell'utente.");
      }

      // Esegui la query per inserire il nuovo utente nella tabella "Condominio"
      const insertQuery = `INSERT INTO Utente (nome, cognome, email, password, p_iva, ruolo) VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [nome, cognome, email, hashedPassword, p_iva, ruolo], (err, result) => {
        if (err) {
          console.error("Errore durante l'inserimento dell'utente:", err);
          return res.status(500).send("Errore durante la registrazione dell'utente.");
        }
        console.log("Nuovo utente inserito con successo.");
        res.sendFile(directory + '/login.html');
      });
    });
  });
});

app.post('/logout', (req, res) => {
  // Rimuovi il token dal localStorage (o sessionStorage) lato client
  localStorage.removeItem('token');

  // Reindirizza l'utente alla pagina di login o a una pagina di benvenuto
  res.redirect(directory + '/login.html'); // Modifica di conseguenza il percorso di reindirizzamento
});

app.post('/insert_payment', (req, res) => {
  const { data, descrizione, codice_identificativo, prezzo } = req.body;
  const condominio_id = 1;
  const utente_id = 1;
  const insertQuery = 'INSERT INTO Pagamento (data, descrizione, codice_identificativo, importo, condominio_id, utente_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [data, descrizione, codice_identificativo, prezzo, condominio_id, utente_id], (err, result) => {
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
      res.status(500).send("Errore del server durante l'aggiornamento del pagamento");
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

//funzione per recuperare i dati dei pagamenti dal database
function getPagamentiFromDatabase(callback) {
  const query = 'SELECT * FROM Pagamento';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }
    //creaione array di popolamento
    const datiPagamenti = [];
    //popolamento dell'array dal risultato della query
    results.forEach((row) => {
      const pagamento = {
        id: row.id,
        data: row.data,
        descrizione: row.descrizione,
        codice_identificativo: row.codice_identificativo,
        importo: row.importo,
        condominio_id: row.condominio_id,
        utente_id: row.utente_id,
      };
      //inserire il singolo dato nell'array
      datiPagamenti.push(pagamento);
    });
    //ritornare i dati della funzione
    callback(null, datiPagamenti);
  })
}

// funzione per recuperare i dati dei condomini dal database
function getCondominiFromDatabase(callback) {
  const query = 'SELECT * FROM Condominio'; // Sostituisci con la tua query SQL effettiva

  db.query(query, (err, results) => {
      if (err) {
          console.error('Errore durante la query al database:', err);
          return callback(err, null);
      }

      // Crea un array per memorizzare tutti i condomini
      const condominiArray = [];

      // Itera attraverso i risultati e crea un oggetto per ciascun condominio
      results.forEach((row) => {
          const condominio = {
              id: row.id,
              nome: row.nome,
              foto: '/elon.jpg', // Percorso dell'immagine
              indirizzo: row.indirizzo,
              n_piani: row.n_piani,
              n_appartamenti: row.n_appartamenti,
              cantine: row.cantine,
              garage: row.garage,
          };

          // Aggiungi l'oggetto condominio all'array dei condomini
          condominiArray.push(condominio);
      });

      // Passa l'array dei condomini come risultato
      callback(null, condominiArray);
  });
}

//route per la pagina dei pagamenti
app.get('/pagamenti', (req, res) => {
  getPagamentiFromDatabase((err, datiPagamenti) => {
    if (err) {
      // Gestisci l'errore
      console.error('Errore durante il recupero dei pagamenti:', err);
      res.status(500).send('Errore durante il recupero dei pagamenti');
    } else {
      // Invia i dati dei pagamenti come risposta JSON
      res.json(datiPagamenti);
    }
  });
});

//route per la pagina dei condomini
app.get('/condomini', (req, res) => {
  getCondominiFromDatabase((err, condominiArray) => {
    if (err) {
      // Gestisci l'errore
      console.error('Errore durante il recupero dei condomini:', err);
      res.status(500).send('Errore durante il recupero dei condomini');
    } else {
      // Invia i dati dei pagamenti come risposta JSON
      res.json(condominiArray);
    }
  });
});



