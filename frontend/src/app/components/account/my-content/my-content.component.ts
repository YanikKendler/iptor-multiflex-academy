import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCirclePlay, faEdit, faEye, faPen, faPencil, faStar} from "@fortawesome/free-solid-svg-icons";
import {faPlayCircle} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-my-content',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './my-content.component.html',
  styleUrl: './my-content.component.scss'
})
export class MyContentComponent {

  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faPlayCircle = faPlayCircle;
  protected readonly faEye = faEye;
  protected readonly faStar = faStar;
  protected readonly faEdit = faEdit;
  protected readonly faPencil = faPencil;
  protected readonly faPen = faPen;
}
