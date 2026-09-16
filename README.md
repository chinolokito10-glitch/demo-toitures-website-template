# Toiture Démo — modèle de site pour couvreurs

Refonte française centrée sur les dossiers de chantier et les informations vérifiables. Toiture Démo est un modèle personnalisable à présenter aux propriétaires d’entreprises de toiture. Aucun numéro, chantier, avis, matériau ou titre professionnel n’est inventé.

## Localhost

```sh
npm install
npm run dev
```

Ouvrir http://localhost:3000. La commande construit le site puis sert uniquement `dist/`. Après modification des sources, relancer `npm run dev`. Pour vérifier un build existant : `npm start`.

## Renseigner l’entreprise

Le contenu se trouve dans **`site.config.js`**. Guide complet : **[docs/CONTENT.md](docs/CONTENT.md)**.

Les photos architecturales générées précédemment restent dans les fichiers existants mais ne sont plus affichées ni chargées par le site. Les preuves non fournies sont signalées. Le téléphone absent ouvre une explication; un vrai numéro active les liens d’appel. Les réalisations vérifiées alimentent le héros et le portfolio, avec uniquement les étapes réellement photographiées.

## Structure

En-tête → héros concret → licence / assurance / expérience / garantie → services → dossiers de chantier → processus en cinq étapes → particularités documentées → avis sourcés → secteurs → FAQ → contact → pied de page.

Le site conserve le menu mobile accessible, les accordéons, les liens internes, les états de focus, le mouvement réduit et le formulaire validé. La barre mobile comporte appel et soumission. Aucun framework frontend ni service de suivi.

## Build et vérification

```sh
npm run build
npm test
npm run test:browser
```

`dist/` contient le site statique. Les tests vérifient le backend, la séparation entre données manquantes et preuves confirmées, le téléphone, le rendu de dossiers réels, le SEO, cinq tailles d’écran, l’accessibilité et le téléchargement d’une demande non envoyée.

## Déploiement Vercel statique

`vercel.json` impose le preset **Other** (`framework: null`), la commande **npm run build** et le dossier **dist**. La racine du projet Vercel doit être la racine de ce dépôt. Le point d’entrée publié est `dist/index.html`; aucune fonction Node n’est nécessaire. Ne pas configurer de redirection vers `server.js` ou `server.mjs`.

Le build contient le HTML, les styles, les modules navigateur, les images et `api/config.json`. Ce fichier indique que les demandes sont en mode démonstration : validation et téléchargement fonctionnent sans serveur ni appel à un destinataire. Les menus, FAQ, galeries et boutons d’appel restent gérés dans le navigateur.

Les tests navigateur servent le dossier de production avec un serveur de fichiers statiques, sans utiliser le serveur de demandes optionnel.

## Réception des demandes (hébergement Node optionnel)

Cette intégration est conservée dans `scripts/lead-server.js` pour un futur site connecté. Elle n’est ni construite ni exécutée par Vercel. Pour l’utiliser sur un hébergement Node : `npm run start:leads`.


Variables serveur, décrites dans `.env.example` :

- `LEAD_WEBHOOK_URL` : destinataire HTTPS qui accepte le JSON.
- `LEAD_WEBHOOK_TOKEN` : jeton facultatif, serveur uniquement.
- `PUBLIC_ORIGIN` : domaine public HTTPS réel.
- `PORT` : 3000 par défaut.

Exemple de démarrage avec variables privées : `node --env-file=.env scripts/lead-server.js`.

L’interface ne confirme l’envoi qu’après acceptation du destinataire. Sans configuration, elle propose une copie téléchargeable et ne simule aucun envoi. Le serveur protège les fichiers privés par une liste explicite des fichiers publics autorisés.

## SEO

Métadonnées, canonical, Open Graph, sitemap et balisage WebPage/FAQ sont conservés. Le schéma RoofingContractor et les services sont limités aux informations confirmées. Les FAQ avec champs manquants sont exclues du schéma. L’image Open Graph provient du premier chantier réel renseigné. Sans identité et couverture vérifiées, l’aperçu reste `noindex`, même si un domaine est configuré.

Pour un hébergement statique, définir `PUBLIC_ORIGIN` au build. Pour Node en production, définir les variables sur l’hôte et utiliser HTTPS via la plateforme d’hébergement.
