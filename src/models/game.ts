import { Grid } from './grid';
import { Tetromino, TetrominoType, RotationState } from './tetromino';

export class Game {
  private _grid: Grid;
  private _currentPiece!: Tetromino; 
  private _nextPiece: Tetromino;
  private _currentPieceX!: number; 
  private _currentPieceY!: number; 
  private _score: number;
  private _level: number;
  private _linesCleared: number;
  private _isGameOver: boolean;
  private _isPaused: boolean;
  private _isAnimatingLines: boolean = false;
  private _linesToAnimate: number[] = [];

  constructor() {
    this._grid = new Grid();
    this._score = 0;
    this._level = 1;
    this._linesCleared = 0;
    this._isGameOver = false;
    this._isPaused = false;
    this._nextPiece = this.generateRandomPiece();
    this.spawnNewPiece();
  }

  get grid(): Grid {
    return this._grid;
  }

  get currentPiece(): Tetromino {
    return this._currentPiece;
  }

  get nextPiece(): Tetromino {
    return this._nextPiece;
  }

  get currentPieceX(): number {
    return this._currentPieceX;
  }

  get currentPieceY(): number {
    return this._currentPieceY;
  }

  get score(): number {
    return this._score;
  }

  get level(): number {
    return this._level;
  }

  get isGameOver(): boolean {
    return this._isGameOver;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  get isAnimatingLines(): boolean {
    return this._isAnimatingLines;
  }

  get linesToAnimate(): number[] {
    return [...this._linesToAnimate];
  }

  togglePause(): void {
    this._isPaused = !this._isPaused;
  }

  reset(): void {
    this._grid = new Grid(10, 20);
    this._currentPiece = this.generateRandomPiece();
    this._nextPiece = this.generateRandomPiece();
    this._currentPieceX = Math.floor((this._grid.width - this._currentPiece.shape[0].length) / 2);
    this._currentPieceY = 0;
    this._score = 0;
    this._level = 1;
    this._linesCleared = 0;
    this._isGameOver = false;
    this._isPaused = false;
    this._isAnimatingLines = false;
    this._linesToAnimate = [];
  }
  
  restart(): void {
    this.reset();
  }

  moveLeft(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    if (this.canMoveLeft()) {
      this._currentPieceX--;
    }
  }

  moveRight(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    if (this.canMoveRight()) {
      this._currentPieceX++;
    }
  }

  moveDown(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    if (this.canMoveDown()) {
      this._currentPieceY++;
    } else {
      this.lockPiece();
    }
  }

  hardDrop(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    while (this.canMoveDown()) {
      this._currentPieceY++;
    }
    
    this.lockPiece();
  }

  rotateClockwise(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    const originalShape = [...this._currentPiece.shape.map(row => [...row])];
    const originalRotation = this._currentPiece.rotation;
    
    this._currentPiece.rotateClockwise();
    
    if (!this._grid.canPlacePiece(this._currentPiece, this._currentPieceX, this._currentPieceY)) {
      // Try wall kick - move left if collision on right side
      if (this._grid.canPlacePiece(this._currentPiece, this._currentPieceX - 1, this._currentPieceY)) {
        this._currentPieceX--;
      } 
      // Try wall kick - move right if collision on left side
      else if (this._grid.canPlacePiece(this._currentPiece, this._currentPieceX + 1, this._currentPieceY)) {
        this._currentPieceX++;
      }
      // If wall kicks don't work, revert rotation
      else {
        // Restore original shape and rotation
        this._currentPiece = new Tetromino(this._currentPiece.type);
        for (let i = 0; i < originalRotation; i += 90) {
          this._currentPiece.rotateClockwise();
        }
      }
    }
  }

  rotateCounterClockwise(): void {
    if (this._isPaused || this._isGameOver || this._isAnimatingLines) return;
    
    const originalShape = [...this._currentPiece.shape.map(row => [...row])];
    const originalRotation = this._currentPiece.rotation;
    
    this._currentPiece.rotateCounterClockwise();
    
    if (!this._grid.canPlacePiece(this._currentPiece, this._currentPieceX, this._currentPieceY)) {
      // Try wall kick - move left if collision on right side
      if (this._grid.canPlacePiece(this._currentPiece, this._currentPieceX - 1, this._currentPieceY)) {
        this._currentPieceX--;
      } 
      // Try wall kick - move right if collision on left side
      else if (this._grid.canPlacePiece(this._currentPiece, this._currentPieceX + 1, this._currentPieceY)) {
        this._currentPieceX++;
      }
      // If wall kicks don't work, revert rotation
      else {
        // Restore original shape and rotation
        this._currentPiece = new Tetromino(this._currentPiece.type);
        for (let i = 0; i < originalRotation; i += 90) {
          this._currentPiece.rotateClockwise();
        }
      }
    }
  }

  canMoveLeft(): boolean {
    return this._grid.canPlacePiece(this._currentPiece, this._currentPieceX - 1, this._currentPieceY);
  }

  canMoveRight(): boolean {
    return this._grid.canPlacePiece(this._currentPiece, this._currentPieceX + 1, this._currentPieceY);
  }

  canMoveDown(): boolean {
    return this._grid.canPlacePiece(this._currentPiece, this._currentPieceX, this._currentPieceY + 1);
  }

  lockPiece(): void {
    if (this._isGameOver || this._isPaused || this._isAnimatingLines) return;
    
    // Placer la pièce sur la grille
    this._grid.placePiece(this._currentPiece, this._currentPieceX, this._currentPieceY);
    
    // Vérifier les lignes complètes
    const completedLines = this._grid.getCompletedLines();
    
    if (completedLines.length > 0) {
      // Marquer les lignes pour l'animation
      this._linesToAnimate = completedLines;
      this._isAnimatingLines = true;
      
      // Le reste du traitement sera fait dans finishLineAnimation()
    } else {
      // Pas de lignes complètes, continuer normalement
      this.spawnNewPiece();
    }
  }

  finishLineAnimation(): void {
    if (!this._isAnimatingLines) return;
    
    // Supprimer les lignes et mettre à jour le score
    const linesCleared = this._linesToAnimate.length;
    this._grid.clearLines(this._linesToAnimate);
    
    // Mettre à jour le score en fonction du nombre de lignes supprimées
    this.updateScore(linesCleared);
    
    // Réinitialiser l'état d'animation
    this._isAnimatingLines = false;
    this._linesToAnimate = [];
    
    // Continuer le jeu
    this.spawnNewPiece();
  }

  private spawnNewPiece(): void {
    this._currentPiece = this._nextPiece;
    this._nextPiece = this.generateRandomPiece();
    
    // Center the piece at the top of the grid
    this._currentPieceX = Math.floor((this._grid.width - this._currentPiece.shape[0].length) / 2);
    this._currentPieceY = 0;
    
    // Check if the new piece can be placed
    if (!this._grid.canPlacePiece(this._currentPiece, this._currentPieceX, this._currentPieceY)) {
      this._isGameOver = true;
    }
  }

  private generateRandomPiece(): Tetromino {
    const types = Object.values(TetrominoType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
  }

  private updateScore(linesCleared: number): void {
    // Update lines cleared count
    this._linesCleared += linesCleared;
    
    // Update level (every 10 lines)
    this._level = Math.floor(this._linesCleared / 10) + 1;
    
    // Calculate score based on number of lines cleared and level
    // Using the original Nintendo scoring system
    let points = 0;
    switch (linesCleared) {
      case 1:
        points = 40;
        break;
      case 2:
        points = 100;
        break;
      case 3:
        points = 300;
        break;
      case 4:
        points = 1200; // Tetris!
        break;
    }
    
    this._score += points * this._level;
  }

  // Method to get the fall speed based on level
  getFallSpeed(): number {
    // Formula based on the original GameBoy Tetris
    // Level 0: 53 frames per grid cell
    // Level 1-9: 49 - 5*(level-1) frames
    // Level 10-19: 30 - 2*(level-10) frames
    // Level 20-29: 10 - (level-20) frames
    // Level 30+: 1 frame
    
    if (this._level === 0) return 53;
    if (this._level <= 9) return 49 - 5 * (this._level - 1);
    if (this._level <= 19) return 30 - 2 * (this._level - 10);
    if (this._level <= 29) return 10 - (this._level - 20);
    return 1;
  }
}
