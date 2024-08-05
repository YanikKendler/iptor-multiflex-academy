import { Routes } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component"
import {ViewVideoComponent} from "./view-video/view-video.component"

export const routes: Routes = [
  {path: "video/:id", component: ViewVideoComponent},
  {path: "**", component: DashboardComponent},
];
