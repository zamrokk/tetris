export enum TetrominoType {
  I = 'I',
  J = 'J',
  L = 'L',
  O = 'O',
  S = 'S',
  T = 'T',
  Z = 'Z'
}

export enum RotationState {
  Zero = 0,
  Ninety = 90,
  OneEighty = 180,
  TwoSeventy = 270
}

type Shape = number[][];

export class Tetromino {
  private _shape: Shape;
  private _rotation: RotationState;
  private _color: string;

  constructor(private _type: TetrominoType) {
    this._rotation = RotationState.Zero;
    this._shape = this.getInitialShape();
    this._color = this.getColor();
  }

  get type(): TetrominoType {
    return this._type;
  }

  get shape(): Shape {
    return this._shape;
  }

  get rotation(): RotationState {
    return this._rotation;
  }

  get color(): string {
    return this._color;
  }

  private getInitialShape(): Shape {
    switch (this._type) {
      case TetrominoType.I:
        return [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
      case TetrominoType.J:
        return [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]
        ];
      case TetrominoType.L:
        return [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0]
        ];
      case TetrominoType.O:
        return [
          [1, 1],
          [1, 1]
        ];
      case TetrominoType.S:
        return [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ];
      case TetrominoType.T:
        return [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ];
      case TetrominoType.Z:
        return [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]
        ];
    }
  }

  private getColor(): string {
    switch (this._type) {
      case TetrominoType.I:
        return '#00f0f0'; // Cyan
      case TetrominoType.J:
        return '#0000f0'; // Blue
      case TetrominoType.L:
        return '#f0a000'; // Orange
      case TetrominoType.O:
        return '#f0f000'; // Yellow
      case TetrominoType.S:
        return '#00f000'; // Green
      case TetrominoType.T:
        return '#a000f0'; // Purple
      case TetrominoType.Z:
        return '#f00000'; // Red
    }
  }

  rotateClockwise(): void {
    const N = this._shape.length;
    const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[j][N - 1 - i] = this._shape[i][j];
      }
    }
    
    this._shape = rotated;
    this._rotation = (this._rotation + 90) % 360 as RotationState;
  }

  rotateCounterClockwise(): void {
    const N = this._shape.length;
    const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
    
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[N - 1 - j][i] = this._shape[i][j];
      }
    }
    
    this._shape = rotated;
    this._rotation = (this._rotation + 270) % 360 as RotationState;
  }
}
