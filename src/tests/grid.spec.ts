import { Grid } from '../models/grid';
import { Tetromino, TetrominoType } from '../models/tetromino';

describe('Grid', () => {
  let grid: Grid;

  beforeEach(() => {
    grid = new Grid();
  });

  describe('Creation', () => {
    it('should create an empty grid with correct dimensions', () => {
      expect(grid.width).toBe(10);
      expect(grid.height).toBe(20);
      expect(grid.cells.length).toBe(20);
      expect(grid.cells[0].length).toBe(10);
    });

    it('should initialize with empty cells', () => {
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          expect(grid.cells[y][x]).toBeNull();
        }
      }
    });
  });

  describe('Piece Placement', () => {
    it('should place tetromino at specified position', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const result = grid.canPlacePiece(tetromino, 3, 0);
      expect(result).toBe(true);
    });

    it('should detect collision with walls', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const result = grid.canPlacePiece(tetromino, -1, 0);
      expect(result).toBe(false);
    });

    it('should detect collision with floor', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const result = grid.canPlacePiece(tetromino, 3, 19);
      expect(result).toBe(false);
    });
  });

  describe('Line Clearing', () => {
    it('should detect complete lines', () => {
      // Fill a line
      for (let x = 0; x < grid.width; x++) {
        grid.cells[18][x] = '#ff0000';
      }
      const completeLines = grid.getCompleteLines();
      expect(completeLines).toContain(18);
    });

    it('should clear complete lines', () => {
      // Fill a line
      for (let x = 0; x < grid.width; x++) {
        grid.cells[18][x] = '#ff0000';
      }
      const linesCleared = grid.clearLines();
      expect(linesCleared).toBe(1);
      expect(grid.cells[18].every(cell => cell === null)).toBe(true);
    });
  });
});
