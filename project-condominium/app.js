const app = new Vue({
    el: '#app',
    data: {
      message: '',
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        fetch('/api/data')
          .then(response => response.json())
          .then(data => {
            this.message = data.message;
          })
          .catch(error => {
            console.error('Si è verificato un errore:', error);
          });
      },
    },
  });