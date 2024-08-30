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
import {VideosComponent} from "./components/account/videos/videos.component"
import {LearningpathsComponent} from "./components/account/learningpaths/learningpaths.component"
import {ManageUsersComponent} from "./components/account/manage-users/manage-users.component"
import {VideoRequestsComponent} from "./components/account/video-requests/video-requests.component"
import {UserStatisticsComponent} from "./components/account/user-statistics/user-statistics.component"
import {PageNotFoundComponent} from "./components/base/page-not-found/page-not-found.component"

export const routes: Routes = [
  {
    path: "video/:id",
    component: VideoDetailComponent,
    canActivate: [canViewGuard],
  },
  {
    path: "learningpath/:id",
    component: LearningPathDetailComponent,
    canActivate: [canViewGuard],
  },
  {
    path: "account",
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'videos',
        pathMatch: 'full'
      },
      {
        path: 'videos',
        component: VideosComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE]}
      },
      {
        path: 'learningpaths',
        component: LearningpathsComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE]}
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, 'MANAGER']}
      },
      {
        path: 'video-requests',
        component: VideoRequestsComponent,
        canActivate: [hasRoleGuard],
        data: {roles: [UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE]}
      },
      {
        path: 'user-statistics',
        component: UserStatisticsComponent,
      },
    ]
  },
  {path: "login", component: LoginComponent},
  {path: "unauthorized", component: UnauthorizedComponent},
  {path: "error/404", component: PageNotFoundComponent},
  {path: "**", component: DashboardComponent},
];
