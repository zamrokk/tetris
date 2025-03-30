# DEVBOOK - Développement du Tetris

## Introduction
Ce document détaille le développement du jeu Tetris en suivant une approche TDD (Test Driven Development). Le projet a été développé en TypeScript, HTML et CSS, en reproduisant fidèlement le gameplay du Tetris original de la GameBoy.

## Étapes de développement

### 1. Configuration du projet
- [x] Initialisation du projet
  - Mise en place de l'environnement TypeScript
  - Configuration du bundler (Vite)
  - Configuration des tests (Jest)
  - ESLint et Prettier pour la qualité du code

Tests implémentés :
- [x] Vérification de la configuration TypeScript
- [x] Vérification de l'environnement de test

### 2. Modèle de données
- [x] Création des classes de base
  - Classe Tetromino (pièces)
  - Classe Grid (grille de jeu)
  - Classe Game (logique principale)

Tests implémentés :
- [x] Test des formes des Tetrominos
- [x] Test des rotations des pièces
- [x] Test des collisions
- [x] Test de la grille de jeu

### 3. Logique du jeu
- [x] Mouvements des pièces
  - Déplacement gauche/droite
  - Rotation
  - Chute
- [x] Système de collision
- [x] Système de lignes complètes

Tests implémentés :
- [x] Test des mouvements de base
- [x] Test des limites de la grille
- [x] Test de la détection des collisions
- [x] Test de la suppression des lignes
- [x] Test du score

### 4. Interface utilisateur
- [x] Création du canvas de jeu
- [x] Affichage des pièces
- [x] Score et niveau
- [x] Prochaine pièce
- [x] Interface GameBoy-like
- [x] Conversion en composant React

Tests à implémenter :
- [x] Test du rendu des pièces
- [x] Test de l'affichage du score
- [x] Test de l'affichage du niveau
- [x] Test de l'aperçu de la prochaine pièce

### 5. Contrôles
- [x] Gestion du clavier
- [x] Système de pause
- [x] Game Over

Tests à implémenter :
- [x] Test des entrées clavier
- [x] Test de la pause
- [x] Test des conditions de fin de partie

### 6. Audio
- [x] Sons originaux GameBoy
- [x] Musique de fond
- [x] Effets sonores

Tests à implémenter :
- [x] Test du chargement des sons
- [x] Test de la lecture audio
- [x] Test du contrôle du volume

### 7. Améliorations React
- [x] Conversion du jeu en composant React
- [x] Structure de projet React
- [x] Gestion de l'état avec les hooks React
- [x] Séparation des préoccupations (logique/rendu)
- [x] Styles CSS modulaires
- [x] Responsive design

Tests à implémenter :
- [x] Test de la structure de projet
- [x] Test de la gestion de l'état
- [x] Test de la séparation des préoccupations
- [x] Test des styles CSS

### 8. Améliorations UI/UX
- [x] Positionnement optimal de la grille
- [x] Affichage de la prochaine pièce à droite de la grille
- [x] Marges adéquates pour éviter la troncature
- [x] Style GameBoy amélioré
- [x] Animations de suppression de lignes
- [x] Effet de "ghost piece" (aperçu de l'emplacement de chute)
- [x] Menu principal
- [x] Tableau des meilleurs scores

## Suivi des versions

### v0.1.0 - Structure de base
- [x] Mise en place du projet
- [x] Tests unitaires de base

### v0.2.0 - Logique du jeu
- [x] Logique de base du jeu

### v0.3.0 - Interface utilisateur
- [x] Rendu graphique
- [x] Contrôles de base

### v0.4.0 - Gameplay complet
- [x] Score et niveaux
- [x] Système de pause
- [x] Game Over

### v0.5.0 - Conversion React
- [x] Composant React pour le jeu
- [x] Gestion de l'état avec hooks
- [x] Styles CSS modulaires
- [x] Responsive design

### v0.6.0 - Améliorations UI/UX
- [x] Optimisation de l'interface
- [x] Positionnement optimal des éléments
- [x] Animations et effets visuels

### v0.7.0 - Audio et polissage
- [x] Sons et musique
- [x] Menu principal
- [x] Tableau des scores
- [x] Optimisation des performances

### v1.0.0 - Version finale
- [x] Tests complets
- [x] Documentation
- [x] Déploiement

## Notes de développement
- Chaque fonctionnalité a été développée en suivant le cycle TDD : Red (test qui échoue) → Green (implémentation minimale) → Refactor
- Les tests ont été écrits avant le code de production
- La qualité du code est maintenue via ESLint et Prettier
- Implémentation du système de "wall kick" pour permettre la rotation des pièces près des bords
- Le système de score est basé sur celui du Tetris original de la GameBoy
