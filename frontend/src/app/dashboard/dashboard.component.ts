import { Component } from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {VideoComponent} from "../video/video.component"
import {Router} from "@angular/router"

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavigationComponent,
    VideoComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
}
