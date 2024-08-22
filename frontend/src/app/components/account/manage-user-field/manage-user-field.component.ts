import {Component, inject, Input} from '@angular/core';
import {User, UserAssignedContentDTO, UserService} from "../../../service/user.service";

@Component({
  selector: 'app-manage-user-field',
  standalone: true,
  imports: [],
  templateUrl: './manage-user-field.component.html',
  styleUrl: './manage-user-field.component.scss'
})
export class ManageUserFieldComponent {
  @Input() user: User = {} as User;
  userService = inject(UserService)

  assignedContent : UserAssignedContentDTO[] = [];

  isExpanded: boolean = false;

  toggle() {
    this.isExpanded = !this.isExpanded;

    if(!this.isExpanded) {
      return
    }

    this.userService.getAssignedUserContent(this.user.userId).subscribe(content => {
      this.assignedContent = content;
    })
  }
}
