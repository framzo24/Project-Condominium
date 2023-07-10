<template>
    <div>
        <header>
        <nav class="navbar">
          <p>Header</p>
        </nav>
      </header>
    </div>
</template>

<script>

export default {
    name: 'Window-Component'
}

</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #330a5e;
  font-size:0.5cm;
  color: aliceblue;
}
</style>