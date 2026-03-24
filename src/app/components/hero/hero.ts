import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class Hero implements AfterViewInit {

  //1. Viewchild busca en el html el elemento que se llama heroVideo y se guarda en la variable videoPlayer

  @ViewChild('heroVideo') videoPlayer!: ElementRef<HTMLVideoElement>;

  //afterviewinit es el gancho de angular, se ejecuta cuando el html ya se dibujo en la pantalla
  ngAfterViewInit(): void {
    this.playVideo();
  }

  //3 aca esta la funcion para forzar el inicio del video. intentamos darle play manualmente por si el navegador no lo hace

  playVideo() {
    const video = this.videoPlayer.nativeElement;
    
    if (video) {
      video.muted = true; // El autoplay requiere que esté muteado sí o sí
      video.play().catch(error => {
        console.log("El autoplay fue bloqueado o tardó en cargar:", error);
      });
    }
  }

}
