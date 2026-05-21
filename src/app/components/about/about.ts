import { Component, inject, signal, OnInit, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements OnInit, AfterViewInit {
  private http = inject(HttpClient);

  sectionRef = viewChild<ElementRef>('aboutSection');
  visible = signal(false);

  productCount = signal(0);
  reviewCount = signal(0);
  whatsappClicks = signal(0);

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/productos`).subscribe({
      next: (res) => {
        const count = Array.isArray(res) ? res.length : (res?.Count ?? res?.count ?? 0);
        this.productCount.set(count);
      }
    });
    this.http.get<any>(`${environment.apiUrl}/contacto/resenas`).subscribe({
      next: (res) => {
        const count = Array.isArray(res) ? res.length : (res?.Count ?? res?.count ?? 0);
        this.reviewCount.set(count);
      }
    });
  }

  ngAfterViewInit() {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.visible.set(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
  }

  contarClick() {
    this.whatsappClicks.update(c => c + 1);
  }
}
