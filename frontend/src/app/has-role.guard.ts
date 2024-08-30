import {ActivatedRoute, CanActivateFn, Router} from "@angular/router"
import {inject} from "@angular/core"
import {User, UserRoleEnum, UserService} from "./service/user.service"
import {firstValueFrom, lastValueFrom} from "rxjs"

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const expectedRoles: UserRoleEnum[] = route.data['roles']
  let router = inject(Router)
  let activatedRoute = inject(ActivatedRoute)
  let userService = inject(UserService)

  userService.currentUser.subscribe(user => {
    if(user.userId <= 0) return

    if(user.userId > 0 && !expectedRoles.includes(userService.currentUser.value.userRole)) {
      router.navigate(['unauthorized'], {queryParams: {rerouteType: 'has-role.guard reroute'}})
    }
  })

  return true
}
