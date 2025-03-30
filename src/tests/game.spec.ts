import { Game } from '../models/game';
import { TetrominoType } from '../models/tetromino';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  describe('Initialization', () => {
    it('should initialize with a grid and a current piece', () => {
      expect(game.grid).toBeDefined();
      expect(game.currentPiece).toBeDefined();
      expect(game.nextPiece).toBeDefined();
      expect(game.score).toBe(0);
      expect(game.level).toBe(1);
      expect(game.isGameOver).toBe(false);
    });
  });

  describe('Piece Movement', () => {
    it('should move piece left when valid', () => {
      const initialX = game.currentPieceX;
      game.moveLeft();
      expect(game.currentPieceX).toBe(initialX - 1);
    });

    it('should not move piece left when at boundary', () => {
      // Force piece to left boundary
      while (game.canMoveLeft()) {
        game.moveLeft();
      }
      const boundaryX = game.currentPieceX;
      game.moveLeft();
      expect(game.currentPieceX).toBe(boundaryX);
    });

    it('should move piece right when valid', () => {
      const initialX = game.currentPieceX;
      game.moveRight();
      expect(game.currentPieceX).toBe(initialX + 1);
    });

    it('should not move piece right when at boundary', () => {
      // Force piece to right boundary
      while (game.canMoveRight()) {
        game.moveRight();
      }
      const boundaryX = game.currentPieceX;
      game.moveRight();
      expect(game.currentPieceX).toBe(boundaryX);
    });

    it('should move piece down when valid', () => {
      const initialY = game.currentPieceY;
      game.moveDown();
      expect(game.currentPieceY).toBe(initialY + 1);
    });

    it('should lock piece and spawn new one when at bottom', () => {
      // Force piece to bottom
      const originalPiece = game.currentPiece;
      while (game.canMoveDown()) {
        game.moveDown();
      }
      game.moveDown(); // This should lock the piece
      expect(game.currentPiece).not.toBe(originalPiece);
    });
  });

  describe('Rotation', () => {
    it('should rotate piece clockwise when valid', () => {
      const initialRotation = game.currentPiece.rotation;
      game.rotateClockwise();
      expect(game.currentPiece.rotation).not.toBe(initialRotation);
    });

    it('should not rotate piece when rotation would cause collision', () => {
      // Force piece to left boundary
      while (game.canMoveLeft()) {
        game.moveLeft();
      }
      
      // Save the current position
      const initialX = game.currentPieceX;
      
      // Try to rotate - this should cause a wall kick (position change)
      if (game.currentPiece.type === TetrominoType.I) {
        game.rotateClockwise();
        // The piece should either have moved (wall kick) or not rotated
        if (game.currentPieceX === initialX) {
          // If position didn't change, shape shouldn't have changed either
          expect(game.currentPiece.rotation).toBe(0);
        } else {
          // If position changed, it was a wall kick
          expect(game.currentPieceX).toBeGreaterThan(initialX);
        }
      }
    });
  });

  describe('Line Clearing', () => {
    it('should increase score when lines are cleared', () => {
      const initialScore = game.score;
      
      // Mock line clearing
      game['handleLineClearing'](1);
      
      expect(game.score).toBeGreaterThan(initialScore);
    });

    it('should increase level after clearing 10 lines', () => {
      const initialLevel = game.level;
      
      // Mock clearing 10 lines
      for (let i = 0; i < 10; i++) {
        game['handleLineClearing'](1);
      }
      
      expect(game.level).toBeGreaterThan(initialLevel);
    });
  });

  describe('Game Over', () => {
    it('should detect game over when piece cannot be placed at spawn position', () => {
      // Mock a game over situation by filling the top of the grid
      for (let x = 0; x < game.grid.width; x++) {
        game.grid.cells[0][x] = '#ff0000';
      }
      
      // Try to spawn a new piece
      game['spawnNewPiece']();
      
      expect(game.isGameOver).toBe(true);
    });
  });
});
