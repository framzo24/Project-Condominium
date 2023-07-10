<template>
    <main>
        <aside class="sidebar">
          <button class="element-aside" v-on:click="change('content-payment')">Pagamenti rette condominiali</button>
          <button class="element-aside" v-on:click="change('content-balance')">Bilancio anni precedenti</button>
          <button class="element-aside" v-on:click="change('content-balance-current')">Bilancio anno corrente</button>
          <button class="element-aside">Progetti futuri</button>
          <button class="element-aside">Famiglie</button>
          <button class="element-aside">Verbali</button>
          <button class="element-aside">Riunioni</button>
          <button class="element-aside">Notifiche</button>
        </aside>
        <div id="container">
          <h1>Contenuto principale della pagina</h1>
        </div>
        <div id="content-payment">
          <h4>Visualizzeremo i pagamenti delle rette condominiali</h4>
        </div>
        <div id="content-balance">
          <h4>Visualizzeremo la sezione dei bilanci</h4>
        </div>
        <div id="content-balance-current">
          <h4>Visualizzeremo la sezione dei bilanci di quest'anno</h4>
        </div>
        <div id="contenuto-2">
          <h2>Contenuto 2</h2>
          <p>Questo è il contenuto che si apre al click del bottone.</p>
        </div>
    </main>
</template>

<script>
export default {
    name: "Main-Content-Component",
    methods: {
      change: function(activecontent) {
      document.getElementById('content-payment').style.display = 'none';
      document.getElementById('content-balance').style.display = 'none';
      document.getElementById('container').style.display = 'none';
      document.getElementById('content-balance-current').style.display = 'none';
      document.getElementById(activecontent).style.display = 'block';
      }
    }
}
</script>

<style>
#content-payment {
  background-color: aliceblue;
  display: none;
  flex: 1;
}
#content-balance {
  background-color: aliceblue;
  display: none;
  flex: 1;
}
#content-balance-current {
  background-color: aliceblue;
  display: none;
  flex: 1;
}
main {
  flex: 1;
  display: flex;
  padding: 0px;
}
#container {
  display:block;
  flex: 1;
  background-color: beige;
  /* Stili per il contenuto principale */
}
.sidebar {
  width: 200px;
  /* Stili per la sidenav */
}
#contenuto-1{
  background-color: aliceblue;
  display: block;
}
#contenuto-2{
  background-color: aqua;
  display: none;
}
.element-aside {
  background-color: white;
  border-color: white;
  padding: 0.5cm;
  margin: 0.4cm;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  align-items: center;
  
}
</style>