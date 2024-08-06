import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component"
import {ViewVideoComponent} from "./view-video/view-video.component"
import {SettingsComponent} from "./settings/settings.component";
import {AccountComponent} from "./account/account.component";

export const routes: Routes = [
  {path: "video/:id", component: ViewVideoComponent},
  {path: "account/:page", component: AccountComponent},
  {path: "**", component: DashboardComponent},
];
