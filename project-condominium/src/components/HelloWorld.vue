<template>
    <div id="app">
    <header>
      <nav class="navbar">
        <h1>Contenuto della barra dei menu</h1>
        <!-- Contenuto della barra dei menu -->
      </nav>
    </header>
    
    <main>
      <aside class="sidebar">
        <h1 class="element-aside">Pagamenti rette condominiali</h1>
        <h1 class="element-aside">Bilancio anni precedenti</h1>
        <h1 class="element-aside">Bilancio anno corrente</h1>
        <h1 class="element-aside">Progetti futuri</h1>
        <h1 class="element-aside">Famiglie</h1>
        <h1 class="element-aside">Verbali</h1>
        <h1 class="element-aside">Riunioni</h1>
        <h1 class="element-aside">Notifiche</h1>
        <!-- Contenuto della sidenav -->
      </aside>
      <div class="container">
        <h1>Contenuto principale della pagina</h1>
        <!-- Contenuto principale della pagina -->
      </div>
    </main>

    <footer>
      <div class="footer">
        <h1>Contenuto principale della pagina</h1>
        <!-- Contenuto del footer -->
      </div>
    </footer>
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
  padding: 0px;
}

.navbar {

}

main {
  flex: 1;
  display: flex;
  padding: 0px;
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
  padding: 0px;
}

.footer {
  /* Stili per il footer */
}

.element-aside {
  background-color: white;
  border-style: solid;
  border-width: 0.02cm;
  border-color: black;
  border-radius: 0.3cm;
}
</style>
