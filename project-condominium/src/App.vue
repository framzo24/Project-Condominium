<template>
  <ComponentWindow />
  <MainContent />
  <FooterContent />
</template>

<script>
import ComponentWindow from './components/component-window.vue'
import FooterContent from './components/footer-content.vue';
import MainContent from './components/main-content.vue'

export default {
  components: {
    ComponentWindow,
    MainContent,
    FooterContent
}
} 
</script>

<style scoped>

</style>