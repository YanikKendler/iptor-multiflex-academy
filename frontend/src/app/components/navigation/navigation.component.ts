import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router"

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() simple: boolean = false;
}
