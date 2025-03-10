export default {
  app: {
    title: 'NaturalMac'
  },
  command: {
    input: {
      placeholder: '_',
      label: 'Demande',
      submit: 'Envoyer',
      processing: 'Traitement...'
    },
    generated: {
      label: 'Commande générée'
    },
    output: {
      label: 'Résultat'
    },
    status: {
      pending: 'En attente',
      generating: 'Génération...',
      confirming: 'En attente de confirmation',
      executing: 'Exécution...',
      completed: 'Terminé',
      error: 'Erreur'
    },
    actions: {
      execute: 'Exécuter',
      cancel: 'Annuler'
    },
    history: {
      title: 'Demandez n\'importe quoi à votre Mac',
      empty: 'Aucune commande pour le moment',
      clear: 'Effacer l\'historique',
      confirmClear: 'Êtes-vous sûr de vouloir effacer tout l\'historique ?'
    }
  }
} 