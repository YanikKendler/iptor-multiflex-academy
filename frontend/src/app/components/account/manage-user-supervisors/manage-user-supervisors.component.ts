import {Component, inject, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogueData} from "../../dialogue/confirm/confirm.component";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";
import {User, UserService} from "../../../service/user.service";
import {VideoOverviewDTO} from "../../../service/video.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-manage-user-supervisors',
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuTrigger,
    MatButton
  ],
  templateUrl: './manage-user-supervisors.component.html',
  styleUrl: './manage-user-supervisors.component.scss'
})
export class ManageUserSupervisorsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ManageUserSupervisorsComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  userOptions : User[] = [];
  userService = inject(UserService);

  supervisor: User | undefined;
  deputySupervisor: User | undefined;

  @ViewChildren(CdkMenuTrigger) trigger!: CdkMenuTrigger[]

  ngOnInit() {
    this.userService.getSupervisors(this.data.userTree.userId).subscribe(supervisors => {
      this.supervisor = supervisors[0];
      this.deputySupervisor = supervisors[1];
    })
  }

  generateUserOptions(value: string) {
    this.userService.searchUsers(this.data.userTree.userId, value).subscribe(users => {
      this.userOptions = users.filter(user => user.userId !== this.data.userTree.userId);
    });
  }

  assignUser(user: User, isSupervisor: boolean) {
    if (isSupervisor) {
      this.supervisor = user;
    } else {
      this.deputySupervisor = user;
    }

    this.userService.setSupervisor(this.data.userTree.userId, user, isSupervisor)
    this.trigger.forEach(trigger => trigger.close());
  }
}
