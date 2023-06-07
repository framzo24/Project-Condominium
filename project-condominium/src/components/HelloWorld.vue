<template>
  <div class="hello">
    <div id="app">
    <header>
      <nav class="navbar">
        <h1>Contenuto della barra dei menu</h1>
        <!-- Contenuto della barra dei menu -->
      </nav>
    </header>

    <main>
      <div class="container">
        <h1>Contenuto principale della pagina</h1>
        <!-- Contenuto principale della pagina -->
      </div>

      <aside class="sidebar">
        <h1>Contenuto principale della pagina</h1>
        <!-- Contenuto della sidenav -->
      </aside>
    </main>

    <footer>
      <div class="footer">
        <h1>Contenuto principale della pagina</h1>
        <!-- Contenuto del footer -->
      </div>
    </footer>
  </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* Stili CSS per l'applicazione */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #f0f0f0;
  padding: 10px;
}

.navbar {
  /* Stili per la barra dei menu */
}

main {
  flex: 1;
  display: flex;
  padding: 20px;
}

.container {
  flex: 1;
  /* Stili per il contenuto principale */
}

.sidebar {
  width: 200px;
  /* Stili per la sidenav */
}

footer {
  background-color: #f0f0f0;
  padding: 10px;
}

.footer {
  /* Stili per il footer */
}
</style>
