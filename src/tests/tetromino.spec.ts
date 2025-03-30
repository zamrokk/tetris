import { Tetromino, TetrominoType, RotationState } from '../models/tetromino';

describe('Tetromino', () => {
  describe('Creation', () => {
    it('should create an I tetromino with correct shape', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      expect(tetromino.type).toBe(TetrominoType.I);
      expect(tetromino.shape).toEqual([
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]);
    });

    it('should initialize with rotation state 0', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      expect(tetromino.rotation).toBe(RotationState.Zero);
    });
  });

  describe('Rotation', () => {
    it('should rotate I tetromino clockwise correctly', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.rotateClockwise();
      expect(tetromino.shape).toEqual([
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ]);
      expect(tetromino.rotation).toBe(RotationState.Ninety);
    });

    it('should rotate I tetromino counter-clockwise correctly', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.rotateCounterClockwise();
      expect(tetromino.shape).toEqual([
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]);
      expect(tetromino.rotation).toBe(RotationState.TwoSeventy);
    });
  });

  describe('Color', () => {
    it('should have correct color for each type', () => {
      const iTetromino = new Tetromino(TetrominoType.I);
      expect(iTetromino.color).toBe('#00f0f0'); // Cyan

      const tTetromino = new Tetromino(TetrominoType.T);
      expect(tTetromino.color).toBe('#a000f0'); // Purple
    });
  });
});
