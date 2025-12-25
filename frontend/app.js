const { createApp } = Vue;

// Configuration de l'URL de l'API
// En développement local: http://localhost:5050
// En Kubernetes: http://backend:5050
const API_URL = window.API_URL || 'http://localhost:5050';

createApp({
  data() {
    return {
      healthMessage: '',
      loading: false,
      error: null,
      lastChecked: null
    };
  },
  methods: {
    async checkHealth() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // L'API retourne du texte brut
        const data = await response.text();
        this.healthMessage = data;
        this.lastChecked = new Date().toLocaleString('fr-FR');
      } catch (err) {
        this.error = `Erreur de connexion: ${err.message}`;
        console.error('Erreur complète:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Vérifier automatiquement l'état au chargement de la page
    this.checkHealth();
  }
}).mount('#app');
