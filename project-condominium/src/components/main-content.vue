<template>
    <main>
        <aside class="sidebar">
          <button class="element-aside">Pagamenti rette condominiali</button>
          <h1 class="element-aside">Bilancio anni precedenti</h1>
          <h1 class="element-aside">Bilancio anno corrente</h1>
          <h1 class="element-aside">Progetti futuri</h1>
          <h1 class="element-aside">Famiglie</h1>
          <h1 class="element-aside">Verbali</h1>
          <h1 class="element-aside">Riunioni</h1>
          <h1 class="element-aside">Notifiche</h1>
        </aside>
        <div class="container">
          <h1>Contenuto principale della pagina</h1>
        </div>
    </main>
</template>

<script>
export default {
    name: "Main-Content-Component"
}
</script>

<style>
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
</style>