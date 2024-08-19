import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {faSortDown} from "@fortawesome/free-solid-svg-icons"
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {NgForOf} from "@angular/common"
import {MatMenuItem} from "@angular/material/menu"

export interface DropdownOption {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CdkMenu,
    FaIconComponent,
    NgForOf,
    CdkMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @ViewChild("dropdown") dropDown!: CdkMenuTrigger;

  @Input()
  options: DropdownOption[] = [];

  @Output()
  optionSelected = new EventEmitter<DropdownOption>()

  @Input()
  selectedId: number | string = -1;
  @Output()
  selectedIdChange = new EventEmitter<number | string>()

  log(){
    console.log("log")
  }

  selectOption(option: DropdownOption){
    this.selectedId = option.id
    this.optionSelected.emit(option)
    this.close()
  }

  close(){
    this.dropDown.close();
  }

  getSelectedOptionName(){
    let option = this.options.find(option => option.id === this.selectedId);
    if(!option){
      return "select an option"
    }
    return option.name;
  }

  protected readonly faSortDown = faSortDown
}
