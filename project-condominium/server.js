const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Pagina principale del server');
});

app.get('/api/data', (req, res) => {
  res.send('Ciao');
});

app.listen(port, () => {
  console.log(`Il server è in esecuzione su http://localhost:${port}`);
});
