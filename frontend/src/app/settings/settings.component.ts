import { Component } from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faCirclePlay, faGear, faUsersGear} from '@fortawesome/free-solid-svg-icons';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, FontAwesomeModule, NgStyle],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  protected readonly faGear = faGear;
  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faUsersGear = faUsersGear;
}
