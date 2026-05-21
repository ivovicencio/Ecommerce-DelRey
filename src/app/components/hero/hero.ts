import { Component, inject, signal, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from '../../services/producto/producto.service';
import { ProductoResponse } from '../../interfaces/producto.interface';
import { environment } from '../../../environments/environment';

interface Resena {
  id: number;
  nombre: string;
  mensaje: string;
  fecha: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class Hero implements AfterViewInit, OnInit {
  @ViewChild('heroVideo') videoPlayer!: ElementRef<HTMLVideoElement>;

  private productService = inject(ProductoService);
  private http = inject(HttpClient);

  productosDestacados = signal<ProductoResponse[]>([]);
  resenas = signal<Resena[]>([]);

  ngOnInit() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productosDestacados.set(data.slice(0, 4));
      }
    });
    this.http.get<Resena[]>(`${environment.apiUrl}/contacto/resenas`).subscribe({
      next: (data) => {
        this.resenas.set(data.slice(0, 6));
      }
    });
  }

  ngAfterViewInit(): void {
    this.playVideo();
  }

  playVideo() {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  irACategoria(cat: string) {
    localStorage.setItem('delrey_filtro', cat);
  }

  trackProducto(index: number, item: ProductoResponse) {
    return item.id;
  }
}
