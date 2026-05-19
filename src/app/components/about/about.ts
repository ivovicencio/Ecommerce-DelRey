import { Component, signal, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements AfterViewInit {
  sectionRef = viewChild<ElementRef>('aboutSection');

  visible = signal(false);

  ngAfterViewInit() {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.visible.set(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(el);
  }
}
