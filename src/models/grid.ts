import { Tetromino } from './tetromino';

export class Grid {
  private _cells: (string | null)[][];
  private _width: number;
  private _height: number;
  
  constructor(width: number = 10, height: number = 20) {
    this._width = width;
    this._height = height;
    this._cells = Array(height).fill(null).map(() => Array(width).fill(null));
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get cells(): (string | null)[][] {
    return this._cells;
  }

  canPlacePiece(tetromino: Tetromino, x: number, y: number): boolean {
    const shape = tetromino.shape;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 0) continue;

        const newX = x + col;
        const newY = y + row;

        // Check boundaries
        if (newX < 0 || newX >= this._width || newY < 0 || newY >= this._height) {
          return false;
        }

        // Check collision with existing pieces
        if (this._cells[newY][newX] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  placePiece(tetromino: Tetromino, x: number, y: number): void {
    const shape = tetromino.shape;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          this._cells[y + row][x + col] = tetromino.color;
        }
      }
    }
  }

  // Obtenir les indices des lignes complètes
  getCompletedLines(): number[] {
    const completedLines: number[] = [];
    
    for (let y = 0; y < this._height; y++) {
      if (this.isLineComplete(y)) {
        completedLines.push(y);
      }
    }
    
    return completedLines;
  }
  
  // Supprimer les lignes spécifiées
  clearLines(lines: number[]): number {
    if (lines.length === 0) return 0;
    
    // Trier les lignes dans l'ordre décroissant pour éviter les problèmes d'index
    const sortedLines = [...lines].sort((a, b) => b - a);
    
    // Supprimer chaque ligne et déplacer les lignes au-dessus vers le bas
    for (const lineY of sortedLines) {
      // Supprimer la ligne
      this._cells.splice(lineY, 1);
      
      // Ajouter une nouvelle ligne vide en haut
      this._cells.unshift(Array(this._width).fill(null));
    }
    
    return lines.length;
  }

  private isLineComplete(y: number): boolean {
    return this._cells[y].every(cell => cell !== null);
  }
}
