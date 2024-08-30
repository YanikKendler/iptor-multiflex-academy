import { Routes } from '@angular/router';
import {VideoDetailComponent} from "./components/video/video-detail/video-detail.component"
import {AccountComponent} from "./components/account/account/account.component"
import {DashboardComponent} from "./components/base/dashboard/dashboard.component"
import {
  LearningPathDetailComponent
} from "./components/learning-path/learning-path-detail/learning-path-detail.component";
import {LoginComponent} from "./components/base/login/login.component";
import {UnauthorizedComponent} from "./components/base/unauthorized/unauthorized.component"
import {hasRoleGuard} from "./has-role.guard"
import {UserRoleEnum} from "./service/user.service"
import {canViewGuard} from "./can-view.guard";
import {PageNotFoundComponent} from "./components/base/page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: "video/:id",
    component: VideoDetailComponent,
    canActivate: [canViewGuard],
    data: {}
  },
  {
    path: "learningpath/:id",
    component: LearningPathDetailComponent,
    canActivate: [canViewGuard],
    data: {}
  },
  {
    path: "account/:page",
    component: AccountComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [ UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE ]
    }},
  {path: "login", component: LoginComponent},
  {path: "unauthorized", component: UnauthorizedComponent},
  {path: "error/404", component: PageNotFoundComponent},
  {path: "**", component: DashboardComponent},
];
