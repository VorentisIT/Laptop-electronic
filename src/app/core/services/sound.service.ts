import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  isMuted = signal<boolean>(true); // Fully muted - zero unwanted audio

  toggleSound(): boolean {
    return false;
  }

  playClick() {
    // Disabled to prevent unwanted sound
  }

  playHover() {
    // Disabled to prevent unwanted sound
  }

  playChime() {
    // Disabled to prevent unwanted sound
  }

  playExplodeSwitch() {
    // Disabled to prevent unwanted sound
  }
}

