import {CanActivateFn, Router} from "@angular/router"
import {inject} from "@angular/core"
import {User, UserRoleEnum, UserService} from "./service/user.service"
import {firstValueFrom, lastValueFrom} from "rxjs"

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const expectedRoles: UserRoleEnum[] = route.data['roles']
  let router = inject(Router)

  inject(UserService).currentUser.subscribe(user => {
    if(user.userId > 0 && !expectedRoles.includes(user.userRole))
     router.navigate(['unauthorized'])
  })

  return true
}
