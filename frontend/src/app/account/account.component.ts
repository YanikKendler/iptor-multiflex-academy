import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NavigationComponent} from "../navigation/navigation.component";
import {faCirclePlay, faGear, faUsersGear} from "@fortawesome/free-solid-svg-icons";
import {SettingsComponent} from "../settings/settings.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MyContentComponent} from "../my-content/my-content.component";
import {ManageUsersComponent} from "../manage-users/manage-users.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FaIconComponent,
    NavigationComponent,
    SettingsComponent,
    MyContentComponent,
    ManageUsersComponent,
    NgClass
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit{

  protected readonly faCirclePlay = faCirclePlay;
  protected readonly faGear = faGear;
  protected readonly faUsersGear = faUsersGear;

  currentPage = 'settings'

  constructor(private route: ActivatedRoute, private router: Router) {  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        this.currentPage = params['page'] || 'settings'
    })
  }

  switchPage(page: "settings" | "my-content" | "manage-users"){
    this.router.navigate(['/account/' + page])
  }
}
