import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router"
import {
  faBell,
  faCirclePlay,
  faCircleUser,
  faEllipsis,
  faGear,
  faTrash,
  faUser,
  faUsersGear
} from "@fortawesome/free-solid-svg-icons";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconButtonComponent} from "../basic/icon-button/icon-button.component";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    CdkMenu,
    FaIconComponent,
    IconButtonComponent,
    MatButton,
    CdkMenuTrigger
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() simple: boolean = false;
    protected readonly faTrash = faTrash;
    protected readonly faEllipsis = faEllipsis;
  protected readonly faUser = faUser;
  protected readonly faCircleUser = faCircleUser;
  protected readonly faGear = faGear;
  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faUsersGear = faUsersGear;
  protected readonly faBell = faBell;
}
