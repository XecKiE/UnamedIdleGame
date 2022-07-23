# Développement

* Pour éviter de commit par erreur les mdp
```bash
git update-index --assume-unchanged server/src/Config.js
```

* Pour passer le dépôt en mode rebase
```bash
git config --local rebase.autostash true
git config --local pull.rebase true
```