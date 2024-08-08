import { Routes } from '@angular/router';
import {VideoDetailComponent} from "./components/video/video-detail/video-detail.component"
import {AccountComponent} from "./components/account/account/account.component"
import {DashboardComponent} from "./components/dashboard/dashboard.component"

export const routes: Routes = [
  {path: "video/:id", component: VideoDetailComponent},
  {path: "account/:page", component: AccountComponent},
  {path: "**", component: DashboardComponent},
];
