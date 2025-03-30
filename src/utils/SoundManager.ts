export class SoundManager {
  private static _instance: SoundManager;
  private _sounds: Map<string, HTMLAudioElement>;
  private _isMuted: boolean = false;
  private _audioContext: AudioContext | null = null;

  private constructor() {
    this._sounds = new Map();
    this.initAudioContext();
  }

  static getInstance(): SoundManager {
    if (!SoundManager._instance) {
      SoundManager._instance = new SoundManager();
    }
    return SoundManager._instance;
  }

  private initAudioContext(): void {
    try {
      // Créer un contexte audio pour générer des sons
      this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API n\'est pas supportée par ce navigateur.', error);
    }
  }

  private preloadSounds(): void {
    // Cette méthode n'est plus utilisée car nous générons les sons dynamiquement
  }

  play(name: string): void {
    if (this._isMuted || !this._audioContext) return;

    // Générer des sons synthétiques au lieu d'utiliser des fichiers audio
    this.generateSound(name);
  }

  private generateSound(type: string): void {
    if (!this._audioContext) return;

    // Créer un oscillateur
    const oscillator = this._audioContext.createOscillator();
    const gainNode = this._audioContext.createGain();

    // Connecter l'oscillateur au gain puis à la destination
    oscillator.connect(gainNode);
    gainNode.connect(this._audioContext.destination);

    // Configurer l'oscillateur en fonction du type de son
    switch (type) {
      case 'move':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, this._audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, this._audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(this._audioContext.currentTime + 0.1);
        break;

      case 'rotate':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(330, this._audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, this._audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(this._audioContext.currentTime + 0.15);
        break;

      case 'drop':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, this._audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, this._audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.4, this._audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(this._audioContext.currentTime + 0.3);
        break;

      case 'clear':
        this.playArpeggio();
        break;

      case 'levelup':
        this.playFanfare();
        break;

      case 'gameover':
        this.playGameOver();
        break;

      case 'theme':
        this.playThemeSound();
        break;
    }
  }

  private playArpeggio(): void {
    if (!this._audioContext) return;

    const notes = [440, 554, 659, 880];

    notes.forEach((freq, index) => {
      const oscillator = this._audioContext!.createOscillator();
      const gainNode = this._audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this._audioContext!.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, this._audioContext!.currentTime + index * 0.1);

      gainNode.gain.setValueAtTime(0.5, this._audioContext!.currentTime + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext!.currentTime + index * 0.1 + 0.2);

      oscillator.start(this._audioContext!.currentTime + index * 0.1);
      oscillator.stop(this._audioContext!.currentTime + index * 0.1 + 0.2);
    });
  }

  private playFanfare(): void {
    if (!this._audioContext) return;

    const notes = [440, 440, 660, 660, 880, 880, 660, 660, 440];
    const durations = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3];

    notes.forEach((freq, index) => {
      const oscillator = this._audioContext!.createOscillator();
      const gainNode = this._audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this._audioContext!.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, this._audioContext!.currentTime + index * 0.15);

      gainNode.gain.setValueAtTime(0.5, this._audioContext!.currentTime + index * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext!.currentTime + index * 0.15 + durations[index]);

      oscillator.start(this._audioContext!.currentTime + index * 0.15);
      oscillator.stop(this._audioContext!.currentTime + index * 0.15 + durations[index]);
    });
  }

  private playGameOver(): void {
    if (!this._audioContext) return;

    const oscillator = this._audioContext.createOscillator();
    const gainNode = this._audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this._audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(440, this._audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, this._audioContext.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0.5, this._audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext.currentTime + 1.5);

    oscillator.start();
    oscillator.stop(this._audioContext.currentTime + 1.5);
  }

  private _themeInterval: number | null = null;

  private playThemeSound(): void {
    if (!this._audioContext) return;

    // Arrêter le thème précédent s'il existe
    this.stopTheme();

    // Séquence de notes pour le thème de Tetris (version simplifiée)
    const theme = [
      { note: 659, duration: 0.15 }, // Mi
      { note: 494, duration: 0.075 }, // Si
      { note: 523, duration: 0.075 }, // Do
      { note: 587, duration: 0.15 }, // Ré
      { note: 523, duration: 0.075 }, // Do
      { note: 494, duration: 0.075 }, // Si
      { note: 440, duration: 0.15 }, // La
      { note: 440, duration: 0.075 }, // La
      { note: 523, duration: 0.075 }, // Do
      { note: 659, duration: 0.15 }, // Mi
      { note: 587, duration: 0.075 }, // Ré
      { note: 523, duration: 0.075 }, // Do
      { note: 494, duration: 0.15 }, // Si
      { note: 494, duration: 0.075 }, // Si
      { note: 523, duration: 0.075 }, // Do
      { note: 587, duration: 0.15 }, // Ré
      { note: 659, duration: 0.15 }, // Mi
      { note: 523, duration: 0.15 }, // Do
      { note: 440, duration: 0.15 }, // La
      { note: 440, duration: 0.15 }, // La
    ];

    let noteIndex = 0;

    // Jouer la séquence en boucle
    const playNote = () => {
      if (this._isMuted || !this._audioContext) {
        return;
      }

      const { note, duration } = theme[noteIndex];

      const oscillator = this._audioContext.createOscillator();
      const gainNode = this._audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this._audioContext.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(note, this._audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, this._audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this._audioContext.currentTime + duration);

      oscillator.start();
      oscillator.stop(this._audioContext.currentTime + duration);

      // Passer à la note suivante
      noteIndex = (noteIndex + 1) % theme.length;
    };

    // Jouer la première note immédiatement
    playNote();

    // Continuer à jouer les notes à intervalles réguliers
    this._themeInterval = window.setInterval(playNote, 200);
  }

  playTheme(): void {
    if (this._isMuted) return;
    this.play('theme');
  }

  stopTheme(): void {
    if (this._themeInterval !== null) {
      clearInterval(this._themeInterval);
      this._themeInterval = null;
    }
  }

  toggleMute(): boolean {
    this._isMuted = !this._isMuted;

    if (this._isMuted) {
      this.stopTheme();
    } else {
      this.playTheme();
    }

    return this._isMuted;
  }

  get isMuted(): boolean {
    return this._isMuted;
  }
}
