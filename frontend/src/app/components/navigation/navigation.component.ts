import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {RouterLink} from "@angular/router"
import {
  faBell,
  faCirclePlay,
  faCircleUser,
  faEllipsis,
  faGear, faMagnifyingGlass, faRightFromBracket,
  faTrash,
  faUser,
  faUsersGear, faXmark
} from "@fortawesome/free-solid-svg-icons";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconButtonComponent} from "../basic/icon-button/icon-button.component";
import {MatButton} from "@angular/material/button";
import {TextfieldComponent} from "../basic/textfield/textfield.component";
import {VideoService} from "../../service/video.service";
import {UserService} from "../../service/user.service";
import {Config} from "../../config";
import {MatDivider} from "@angular/material/divider"
import {LearningPathIconComponent} from "../icons/learning-path-icon/learning-path-icon.component";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    CdkMenu,
    FaIconComponent,
    IconButtonComponent,
    MatButton,
    CdkMenuTrigger,
    TextfieldComponent,
    LearningPathIconComponent,
    TextfieldComponent,
    LearningPathIconComponent,
    MatDivider
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Input() simple: boolean = false;

  @ViewChild(CdkMenuTrigger) trigger!: CdkMenuTrigger;

  closeMenu() {
    this.trigger.close();
  }

  @Output() search = new EventEmitter<string>();
  protected readonly faTrash = faTrash;
  protected readonly faEllipsis = faEllipsis;
  protected readonly faUser = faUser;
  protected readonly faCircleUser = faCircleUser;
  protected readonly faGear = faGear;
  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faUsersGear = faUsersGear;
  protected readonly faBell = faBell;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faXmark = faXmark
  protected readonly faRightFromBracket = faRightFromBracket;

  logout() {
    localStorage.removeItem("USER_ID")
    localStorage.removeItem("USER_PASSWORD")
    Config.USER_ID = -1
  }
}


