import { Component } from '@angular/core';
import {NavigationComponent} from "../../navigation/navigation.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faCirclePlay, faGear, faUsersGear} from '@fortawesome/free-solid-svg-icons';
import {NgStyle} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, FontAwesomeModule, NgStyle, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  protected readonly faGear = faGear;
  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faUsersGear = faUsersGear;
}
