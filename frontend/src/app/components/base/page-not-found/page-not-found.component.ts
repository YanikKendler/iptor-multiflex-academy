import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NavigationComponent} from "../navigation/navigation.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButton,
    NavigationComponent,
    RouterLink
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

}
