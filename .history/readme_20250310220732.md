# NaturalMac

Un assistant intelligent pour macOS qui convertit les commandes en langage naturel en commandes terminal, propulsé par l'IA Claude de Anthropic.

## 🌟 Fonctionnalités

- Interface moderne et intuitive
- Conversion de langage naturel en commandes terminal
- Validation des commandes avant exécution
- Historique des commandes avec leurs résultats
- Support du thème sombre
- Sécurité renforcée pour les commandes sensibles

## 🚀 Installation

1. Clonez le dépôt
```bash
git clone <url-du-repo>
cd naturalmac
```

2. Installez les dépendances
```bash
yarn install
```

3. Configurez les variables d'environnement
```bash
cp .env.example .env
```
Ajoutez votre clé API Anthropic dans le fichier `.env` :
```
VITE_ANTHROPIC_API_KEY=votre-clé-api
```

## 🖥️ Développement

Lancer l'application en mode développement :
```bash
yarn electron:dev
```

Build l'application :
```bash
yarn electron:build
```

## 🔒 Sécurité

L'application inclut plusieurs mesures de sécurité :
- Validation des commandes sensibles
- Restriction des chemins d'accès
- Isolation du contexte Electron
- Blocage des commandes dangereuses (rm -rf, sudo, etc.)

## 📝 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.