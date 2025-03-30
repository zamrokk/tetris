import React, { useEffect, useRef, useState } from 'react';
import { Game } from '../models/game';
import { Renderer } from '../views/renderer';
import { SoundManager } from '../utils/SoundManager';

// Constantes pour le jeu
const FRAME_RATE = 60;
const INITIAL_FALL_INTERVAL = 1000; // 1 seconde entre chaque chute au niveau 1

const TetrisGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationFrameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastFallTimeRef = useRef<number>(0);
  const fallIntervalRef = useRef<number>(INITIAL_FALL_INTERVAL); // 1 seconde par défaut
  const soundManagerRef = useRef<SoundManager>(SoundManager.getInstance());

  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Initialisation du jeu
  useEffect(() => {
    if (!canvasRef.current) return;

    // Définir une taille de canvas plus grande
    canvasRef.current.width = 580;
    canvasRef.current.height = 750; // Augmenté pour assurer la visibilité de toutes les lignes

    // Initialiser le jeu
    const game = new Game();
    gameRef.current = game;

    // Initialiser le renderer
    const renderer = new Renderer(canvasRef.current, game);
    rendererRef.current = renderer;

    // Initialiser les événements clavier
    window.addEventListener('keydown', handleKeyDown);

    // Démarrer la boucle de jeu
    lastTimeRef.current = performance.now();
    startGameLoop();

    // Démarrer la musique de fond
    soundManagerRef.current.playTheme();

    return () => {
      // Nettoyage lors du démontage du composant
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameIdRef.current);
      soundManagerRef.current.stopTheme();
    };
  }, []);

  // Mettre à jour les états React depuis le jeu
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (gameRef.current) {
        setScore(gameRef.current.score);
        setLevel(gameRef.current.level);
        setIsGameOver(gameRef.current.isGameOver);
      }
    }, 100);

    return () => clearInterval(updateInterval);
  }, []);

  const startGameLoop = () => {
    const gameLoop = (currentTime: number) => {
      if (!gameRef.current || !rendererRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const game = gameRef.current;
      const renderer = rendererRef.current;

      // Ne pas mettre à jour la logique si le jeu est en pause ou terminé
      if (!game.isPaused && !game.isGameOver) {
        // Gérer la chute automatique des pièces
        if (currentTime - lastFallTimeRef.current > fallIntervalRef.current) {
          // Si des lignes sont en cours d'animation, terminer l'animation
          if (game.isAnimatingLines) {
            game.finishLineAnimation();
            // Jouer le son de suppression de ligne
            soundManagerRef.current.play('clear');
            // Mettre à jour les états React
            setScore(game.score);
            setLevel(game.level);
          } else {
            // Sinon, faire tomber la pièce
            game.moveDown();
          }
          lastFallTimeRef.current = currentTime;
        }

        // Si des lignes sont en cours d'animation, les animer
        if (game.isAnimatingLines) {
          renderer.setLinesToAnimate(game.linesToAnimate);
        }
      }

      // Vérifier si le jeu est terminé
      if (game.isGameOver && !isGameOver) {
        setIsGameOver(true);
        soundManagerRef.current.play('gameover');
        soundManagerRef.current.stopTheme();
      }

      // Mettre à jour l'affichage
      renderer.render();

      // Continuer la boucle de jeu
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    // Démarrer la boucle
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!gameRef.current) return;

    const game = gameRef.current;
    const renderer = rendererRef.current;

    switch (event.key) {
      case 'ArrowLeft':
        game.moveLeft();
        soundManagerRef.current.play('move');
        break;
      case 'ArrowRight':
        game.moveRight();
        soundManagerRef.current.play('move');
        break;
      case 'ArrowUp':
        game.rotateClockwise();
        soundManagerRef.current.play('rotate');
        break;
      case 'ArrowDown':
        game.moveDown();
        soundManagerRef.current.play('move');
        break;
      case ' ': // Espace
        game.hardDrop();
        soundManagerRef.current.play('drop');
        break;
      case 'p':
      case 'P':
        game.togglePause();
        setIsPaused(game.isPaused);
        break;
      case 'Enter':
        if (game.isGameOver) {
          game.restart();
          setScore(0);
          setLevel(1);
          setIsGameOver(false);
          soundManagerRef.current.playTheme();
        }
        break;
      case 'g':
      case 'G':
        // Toggle ghost piece
        if (renderer) {
          renderer.toggleGhostPiece();
        }
        break;
      case 'm':
      case 'M':
        // Toggle mute
        const muted = soundManagerRef.current.toggleMute();
        setIsMuted(muted);
        break;
    }
  };

  return (
    <div className="gameboy">
      <h1>TETRIS</h1>
      <div className="screen-container">
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            margin: '15px',
            backgroundColor: '#9BBC0F',
            border: '2px solid #0F380F',
          }}
        />
      </div>
      <div className="game-info">
        <div className="score-display">Score: {score}</div>
        <div className="level-display">Level: {level}</div>
        <div className="sound-toggle">
          <button
            onClick={() => {
              const muted = soundManagerRef.current.toggleMute();
              setIsMuted(muted);
            }}
          >
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </div>
      </div>
      <div className="instructions">
        <p>
          <strong>Controls:</strong>
        </p>
        <p>← → : Move left/right</p>
        <p>↑ : Rotate</p>
        <p>↓ : Move down</p>
        <p>Space : Hard drop</p>
        <p>P : Pause</p>
        <p>G : Toggle ghost piece</p>
        <p>M : Toggle sound</p>
        <p>Enter : Restart (after game over)</p>
      </div>
    </div>
  );
};

export default TetrisGame;
