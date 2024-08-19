import { Routes } from '@angular/router';
import {VideoDetailComponent} from "./components/video/video-detail/video-detail.component"
import {AccountComponent} from "./components/account/account/account.component"
import {DashboardComponent} from "./components/dashboard/dashboard.component"
import {
  LearningPathDetailComponent
} from "./components/learning-path/learning-path-detail/learning-path-detail.component";

export const routes: Routes = [
  {path: "video/:id", component: VideoDetailComponent},
  {path: "learningpath/:id", component: LearningPathDetailComponent},
  {path: "account/:page", component: AccountComponent},
  {path: "**", component: DashboardComponent},
];
