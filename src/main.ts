import { Game } from './models/game';
import { Renderer } from './views/renderer';

// Constantes pour le jeu
const FRAME_RATE = 60;
const INITIAL_FALL_INTERVAL = 1000; // 1 seconde entre chaque chute au niveau 1

// Classe principale du jeu
class TetrisGame {
  private game: Game;
  private renderer: Renderer;
  private canvas: HTMLCanvasElement;
  private lastTime: number = 0;
  private fallInterval: number = INITIAL_FALL_INTERVAL;
  private lastFallTime: number = 0;
  private isPaused: boolean = false;
  private animationFrameId: number = 0;

  constructor() {
    // Initialisation du canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 640;
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    this.canvas.style.backgroundColor = '#9BBC0F';
    
    // Ajouter le canvas au conteneur de jeu s'il existe, sinon au body
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      gameContainer.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }

    // Initialisation du jeu et du renderer
    this.game = new Game();
    this.renderer = new Renderer(this.canvas, this.game);

    // Ajout des écouteurs d'événements
    this.setupEventListeners();

    // Démarrer la boucle de jeu
    this.startGameLoop();
  }

  private setupEventListeners(): void {
    // Gestion des contrôles clavier
    document.addEventListener('keydown', (event) => {
      if (this.game.isGameOver) {
        // Si le jeu est terminé, redémarrer avec Entrée
        if (event.key === 'Enter') {
          this.restartGame();
        }
        return;
      }

      if (this.isPaused) {
        // Si le jeu est en pause, reprendre avec P
        if (event.key === 'p' || event.key === 'P') {
          this.togglePause();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          this.game.moveLeft();
          break;
        case 'ArrowRight':
          this.game.moveRight();
          break;
        case 'ArrowDown':
          this.game.moveDown();
          break;
        case 'ArrowUp':
          this.game.rotateClockwise();
          break;
        case ' ': // Espace pour hard drop
          this.hardDrop();
          break;
        case 'p':
        case 'P':
          this.togglePause();
          break;
      }
    });
  }

  private startGameLoop(): void {
    // Boucle de jeu principale
    const gameLoop = (timestamp: number) => {
      // Calculer le delta time
      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;

      if (!this.isPaused && !this.game.isGameOver) {
        // Mettre à jour la logique du jeu
        this.update(deltaTime);
      }

      // Rendre le jeu
      this.renderer.render();

      // Afficher l'écran de pause si nécessaire
      if (this.isPaused) {
        this.renderPauseScreen();
      }

      // Continuer la boucle
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Démarrer la boucle
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private update(deltaTime: number): void {
    // Ajuster l'intervalle de chute en fonction du niveau
    this.fallInterval = INITIAL_FALL_INTERVAL / this.game.level;

    // Faire tomber la pièce à intervalles réguliers
    this.lastFallTime += deltaTime;
    if (this.lastFallTime >= this.fallInterval) {
      this.game.moveDown();
      this.lastFallTime = 0;
    }
  }

  private hardDrop(): void {
    // Faire tomber la pièce jusqu'en bas
    while (this.game.canMoveDown()) {
      this.game.moveDown();
    }
    // Verrouiller la pièce
    this.game.moveDown();
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  private renderPauseScreen(): void {
    const ctx = this.canvas.getContext('2d')!;
    
    // Overlay semi-transparent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Texte de pause
    ctx.fillStyle = '#9BBC0F';
    ctx.font = '30px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    
    // Instructions pour reprendre
    ctx.font = '16px monospace';
    ctx.fillText('Press P to resume', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  private restartGame(): void {
    // Réinitialiser le jeu
    this.game = new Game();
    this.renderer = new Renderer(this.canvas, this.game);
    this.lastFallTime = 0;
    this.isPaused = false;
  }
}

// Initialiser le jeu lorsque la page est chargée
window.addEventListener('DOMContentLoaded', () => {
  // Initialiser le jeu
  new TetrisGame();
});

console.log('Tetris Game Initialized');
