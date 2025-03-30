import { Renderer } from '../views/renderer';
import { Game } from '../models/game';
import { TetrominoType } from '../models/tetromino';

// Mock pour le canvas et le contexte 2D
class MockCanvasRenderingContext2D {
  fillStyle: string = '';
  strokeStyle: string = '';
  lineWidth: number = 1;
  font: string = '';
  textAlign: string = '';
  textBaseline: string = '';
  
  fillRect = jest.fn();
  strokeRect = jest.fn();
  clearRect = jest.fn();
  fillText = jest.fn();
  beginPath = jest.fn();
  moveTo = jest.fn();
  lineTo = jest.fn();
  stroke = jest.fn();
}

describe('Renderer', () => {
  let renderer: Renderer;
  let game: Game;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: MockCanvasRenderingContext2D;
  
  beforeEach(() => {
    // Créer un mock du canvas et du contexte
    mockCanvas = document.createElement('canvas');
    mockContext = new MockCanvasRenderingContext2D();
    
    // Mock de getContext pour retourner notre contexte mock
    jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext as unknown as CanvasRenderingContext2D);
    
    // Initialiser le jeu et le renderer
    game = new Game();
    renderer = new Renderer(mockCanvas, game);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('Initialization', () => {
    it('should initialize with canvas and game', () => {
      expect(renderer).toBeDefined();
      expect(renderer.canvas).toBe(mockCanvas);
      expect(renderer.game).toBe(game);
    });
  });
  
  describe('Rendering', () => {
    it('should clear the canvas before rendering', () => {
      renderer.render();
      expect(mockContext.clearRect).toHaveBeenCalled();
    });
    
    it('should render the grid', () => {
      renderer.render();
      // Vérifier que fillRect est appelé pour chaque cellule de la grille
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
    
    it('should render the current piece', () => {
      renderer.render();
      // La pièce actuelle devrait être rendue
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
    
    it('should render the next piece', () => {
      renderer.renderNextPiece();
      expect(mockContext.fillRect).toHaveBeenCalled();
    });
    
    it('should render the score and level', () => {
      renderer.renderInfo();
      expect(mockContext.fillText).toHaveBeenCalledWith(expect.stringContaining('Score'), expect.any(Number), expect.any(Number));
      expect(mockContext.fillText).toHaveBeenCalledWith(expect.stringContaining('Level'), expect.any(Number), expect.any(Number));
    });
  });
  
  describe('Game Over', () => {
    it('should render game over screen when game is over', () => {
      // Forcer l'état de game over
      Object.defineProperty(game, 'isGameOver', { get: () => true });
      
      renderer.render();
      expect(mockContext.fillText).toHaveBeenCalledWith(expect.stringContaining('GAME OVER'), expect.any(Number), expect.any(Number));
    });
  });
});
