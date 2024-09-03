import { Component } from '@angular/core';

@Component({
  selector: 'app-dot-loader',
  standalone: true,
  imports: [],
  templateUrl: './dot-loader.component.html',
  styleUrl: './dot-loader.component.scss'
})
export class DotLoaderComponent {
  dotsVisible = 3;

  constructor() {
    setInterval(() => {
      this.dotsVisible = (this.dotsVisible + 1) % 4;
    }, 300);
  }
}
