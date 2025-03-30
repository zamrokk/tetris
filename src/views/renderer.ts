import { Game } from '../models/game';
import { Tetromino } from '../models/tetromino';

export class Renderer {
  private _context: CanvasRenderingContext2D;
  private _cellSize: number;
  private _gridOffsetX: number;
  private _gridOffsetY: number;
  private _nextPieceOffsetX: number;
  private _nextPieceOffsetY: number;
  private _animationLines: number[] = []; // Lignes en cours d'animation
  private _animationStep: number = 0; // Étape d'animation actuelle
  private _ghostPieceEnabled: boolean = true; // Activer/désactiver la ghost piece
  
  constructor(private _canvas: HTMLCanvasElement, private _game: Game) {
    this._context = this._canvas.getContext('2d')!;
    this._cellSize = 30;
    
    // Calculer les offsets pour centrer la grille
    const gridWidth = this._game.grid.width * this._cellSize;
    const gridHeight = this._game.grid.height * this._cellSize;
    
    // Augmenter la marge verticale pour assurer la visibilité de toutes les lignes
    this._gridOffsetX = 40;
    this._gridOffsetY = Math.max(50, (this._canvas.height - gridHeight) / 2);
    
    // Position de la prochaine pièce (à droite de la grille)
    this._nextPieceOffsetX = this._gridOffsetX + gridWidth + 40;
    this._nextPieceOffsetY = this._gridOffsetY + 50;
  }
  
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }
  
  get game(): Game {
    return this._game;
  }
  
  render(): void {
    // Effacer le canvas
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    
    // Dessiner l'arrière-plan dans le style GameBoy
    this.renderBackground();
    
    // Dessiner la grille
    this.renderGrid();
    
    // Dessiner la ghost piece si activée
    if (this._ghostPieceEnabled && !this._game.isGameOver && !this._game.isPaused) {
      this.renderGhostPiece();
    }
    
    // Dessiner la pièce active
    this.renderCurrentPiece();
    
    // Dessiner la prochaine pièce
    this.renderNextPiece();
    
    // Afficher le score et le niveau
    this.renderInfo();
    
    // Animer les lignes complètes si nécessaire
    if (this._animationLines.length > 0) {
      this.renderLineAnimation();
    }
    
    // Afficher l'écran de game over si nécessaire
    if (this._game.isGameOver) {
      this.renderGameOver();
    }
    
    // Afficher l'écran de pause si nécessaire
    if (this._game.isPaused && !this._game.isGameOver) {
      this.renderPauseScreen();
    }
  }
  
  renderBackground(): void {
    // Fond de l'écran GameBoy
    this._context.fillStyle = '#9BBC0F';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    // Bordure de la grille
    this._context.strokeStyle = '#0F380F';
    this._context.lineWidth = 2;
    this._context.strokeRect(
      this._gridOffsetX - 6, 
      this._gridOffsetY - 6, 
      this._game.grid.width * this._cellSize + 12, 
      this._game.grid.height * this._cellSize + 12
    );
  }
  
  renderGrid(): void {
    const grid = this._game.grid;
    
    // Dessiner les cellules occupées
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.cells[y][x];
        if (cell !== null) {
          this.drawCell(x, y, cell);
        } else {
          // Dessiner une cellule vide
          this.drawEmptyCell(x, y);
        }
      }
    }
  }
  
  renderCurrentPiece(): void {
    const piece = this._game.currentPiece;
    const x = this._game.currentPieceX;
    const y = this._game.currentPieceY;
    
    this.renderPiece(piece, x, y);
  }
  
  renderNextPiece(): void {
    const nextPiece = this._game.nextPiece;
    
    // Dessiner un fond pour la zone de la prochaine pièce
    this._context.fillStyle = '#8BAC0F';
    this._context.fillRect(
      this._nextPieceOffsetX - 50, 
      this._nextPieceOffsetY - 40, 
      100, 
      120
    );
    
    // Titre "NEXT"
    this._context.fillStyle = '#0F380F';
    this._context.font = '16px monospace';
    this._context.textAlign = 'center';
    this._context.fillText('NEXT', this._nextPieceOffsetX, this._nextPieceOffsetY - 20);
    
    // Dessiner un cadre pour la prochaine pièce
    this._context.strokeStyle = '#0F380F';
    this._context.lineWidth = 2;
    this._context.strokeRect(
      this._nextPieceOffsetX - 40, 
      this._nextPieceOffsetY - 10, 
      80, 
      80
    );
    
    // Dessiner la prochaine pièce centrée dans le cadre
    const offsetX = this._nextPieceOffsetX - (nextPiece.shape[0].length * this._cellSize / 2);
    const offsetY = this._nextPieceOffsetY;
    
    this.renderPiece(nextPiece, 0, 0, offsetX, offsetY);
  }
  
  renderInfo(): void {
    // Afficher le score
    this._context.fillStyle = '#0F380F';
    this._context.font = '16px monospace';
    this._context.textAlign = 'left';
    this._context.fillText(`Score: ${this._game.score}`, 20, 30);
    
    // Afficher le niveau
    this._context.fillText(`Level: ${this._game.level}`, 20, 60);
  }
  
  renderGameOver(): void {
    // Overlay semi-transparent
    this._context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    // Texte de game over
    this._context.fillStyle = '#9BBC0F';
    this._context.font = '30px monospace';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText('GAME OVER', this._canvas.width / 2, this._canvas.height / 2 - 20);
    
    // Score final
    this._context.font = '20px monospace';
    this._context.fillText(`Score: ${this._game.score}`, this._canvas.width / 2, this._canvas.height / 2 + 20);
    
    // Instructions pour recommencer
    this._context.font = '16px monospace';
    this._context.fillText('Press ENTER to restart', this._canvas.width / 2, this._canvas.height / 2 + 60);
  }
  
  renderGhostPiece(): void {
    const piece = this._game.currentPiece;
    const x = this._game.currentPieceX;
    let y = this._game.currentPieceY;
    
    // Trouver la position la plus basse possible pour la pièce
    while (this._game.grid.canPlacePiece(piece, x, y + 1)) {
      y++;
    }
    
    // Ne pas afficher la ghost piece si elle est au même endroit que la pièce actuelle
    if (y === this._game.currentPieceY) {
      return;
    }
    
    // Dessiner la ghost piece
    const shape = piece.shape;
    
    for (let shapeY = 0; shapeY < shape.length; shapeY++) {
      for (let shapeX = 0; shapeX < shape[shapeY].length; shapeX++) {
        if (shape[shapeY][shapeX] === 1) {
          const xPos = this._gridOffsetX + (x + shapeX) * this._cellSize;
          const yPos = this._gridOffsetY + (y + shapeY) * this._cellSize;
          
          // Dessiner une version transparente de la pièce
          this._context.fillStyle = 'rgba(255, 255, 255, 0.3)';
          this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
          
          // Bordure de la cellule
          this._context.strokeStyle = '#0F380F';
          this._context.lineWidth = 0.5;
          this._context.strokeRect(xPos, yPos, this._cellSize, this._cellSize);
        }
      }
    }
  }
  
  renderLineAnimation(): void {
    // Animer les lignes complètes avant de les supprimer
    this._animationStep++;
    
    // 10 étapes d'animation
    if (this._animationStep > 10) {
      this._animationLines = [];
      this._animationStep = 0;
      return;
    }
    
    // Effet de clignotement
    const isVisible = this._animationStep % 2 === 0;
    
    for (const lineY of this._animationLines) {
      for (let x = 0; x < this._game.grid.width; x++) {
        const xPos = this._gridOffsetX + x * this._cellSize;
        const yPos = this._gridOffsetY + lineY * this._cellSize;
        
        if (isVisible) {
          // Cellule blanche clignotante
          this._context.fillStyle = '#FFFFFF';
          this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
        } else {
          // Cellule noire clignotante
          this._context.fillStyle = '#0F380F';
          this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
        }
      }
    }
  }
  
  renderPauseScreen(): void {
    // Overlay semi-transparent
    this._context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    // Texte de pause
    this._context.fillStyle = '#9BBC0F';
    this._context.font = '30px monospace';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText('PAUSE', this._canvas.width / 2, this._canvas.height / 2 - 20);
    
    // Instructions pour reprendre
    this._context.font = '16px monospace';
    this._context.fillText('Press P to resume', this._canvas.width / 2, this._canvas.height / 2 + 20);
  }
  
  private renderPiece(piece: Tetromino, gridX: number, gridY: number, offsetX?: number, offsetY?: number): void {
    const shape = piece.shape;
    const color = piece.color;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          if (offsetX !== undefined && offsetY !== undefined) {
            // Rendu avec offset personnalisé (pour la prochaine pièce)
            this.drawCellWithOffset(x, y, color, offsetX, offsetY);
          } else {
            // Rendu dans la grille principale
            this.drawCell(gridX + x, gridY + y, color);
          }
        }
      }
    }
  }
  
  private drawCell(x: number, y: number, color: string): void {
    const xPos = this._gridOffsetX + x * this._cellSize;
    const yPos = this._gridOffsetY + y * this._cellSize;
    
    // Remplir la cellule
    this._context.fillStyle = color;
    this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
    
    // Bordure de la cellule
    this._context.strokeStyle = '#0F380F';
    this._context.lineWidth = 1;
    this._context.strokeRect(xPos, yPos, this._cellSize, this._cellSize);
    
    // Effet de lumière (style GameBoy)
    this._context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this._context.fillRect(xPos, yPos, this._cellSize / 3, this._cellSize / 3);
  }
  
  private drawEmptyCell(x: number, y: number): void {
    const xPos = this._gridOffsetX + x * this._cellSize;
    const yPos = this._gridOffsetY + y * this._cellSize;
    
    // Cellule vide (légèrement plus sombre que l'arrière-plan)
    this._context.fillStyle = '#8BAC0F';
    this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
    
    // Bordure de la cellule
    this._context.strokeStyle = '#0F380F';
    this._context.lineWidth = 0.5;
    this._context.strokeRect(xPos, yPos, this._cellSize, this._cellSize);
  }
  
  private drawCellWithOffset(x: number, y: number, color: string, offsetX: number, offsetY: number): void {
    const xPos = offsetX + x * this._cellSize;
    const yPos = offsetY + y * this._cellSize;
    
    // Remplir la cellule
    this._context.fillStyle = color;
    this._context.fillRect(xPos, yPos, this._cellSize, this._cellSize);
    
    // Bordure de la cellule
    this._context.strokeStyle = '#0F380F';
    this._context.lineWidth = 1;
    this._context.strokeRect(xPos, yPos, this._cellSize, this._cellSize);
    
    // Effet de lumière (style GameBoy)
    this._context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this._context.fillRect(xPos, yPos, this._cellSize / 3, this._cellSize / 3);
  }
  
  // Méthode pour définir les lignes à animer
  setLinesToAnimate(lines: number[]): void {
    this._animationLines = lines;
    this._animationStep = 0;
  }
  
  // Méthode pour activer/désactiver la ghost piece
  toggleGhostPiece(): void {
    this._ghostPieceEnabled = !this._ghostPieceEnabled;
  }
  
  get ghostPieceEnabled(): boolean {
    return this._ghostPieceEnabled;
  }
}
