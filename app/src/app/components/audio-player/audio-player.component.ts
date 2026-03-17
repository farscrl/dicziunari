import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-audio-player',
  imports: [IonIcon],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
})
export class AudioPlayerComponent {
  private toastService = inject(ToastService);

  @Input() url?: string;

  isPlaying = false;
  @ViewChild('audioControl') audioControl!: ElementRef<HTMLAudioElement>;

  async play() {
    if (!this.url) {
      return;
    }

    if (!navigator.onLine) {
      await this.toastService.showNotification('AUDIO.OFFLINE');
      return;
    }

    const audioElement = this.audioControl.nativeElement;
    audioElement.src = this.getMp3UrlById(this.url);
    audioElement.load();
    audioElement.addEventListener('ended', () => {
      audioElement.currentTime = 0;
      this.isPlaying = false;
      // console.log("audio ended");
    });
    this.isPlaying = true;
    await audioElement.play();
  }

  async pause() {
    const audioElement = this.audioControl.nativeElement;
    this.isPlaying = false;
    audioElement.pause();
    audioElement.currentTime = 0;
  }

  getMp3UrlById(pronunciation: string) {
    const parts = pronunciation.split('/');
    if (parts.length < 2) {
      throw new Error('pronunciation does not contain a slash or does not have two parts');
    }
    const env = parts[0];
    const id = parts[1];

    return `https://pg-data.b-cdn.net/pronunciation/${env}/${id}/${id}.mp3`;
  }
}
