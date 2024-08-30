import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserRoleEnum, UserService } from './service/user.service';
import { inject } from '@angular/core';

export const canViewGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const contentId = Number(route.paramMap.get('id'));
  const router = inject(Router);
  const userService = inject(UserService);

  userService.currentUser.subscribe(user => {
    if(user.userId <= 0) return;

    userService.isUserAllowedToSeeContent(contentId).subscribe(isAllowed => {
      if(isAllowed == null){
        router.navigate(['error/404']);
      }

      if (!isAllowed) {
        router.navigate(['unauthorized'], {queryParams: {rerouteType: 'can-view.guard reroute'}});
      }
    });
  })

  return true;
};
