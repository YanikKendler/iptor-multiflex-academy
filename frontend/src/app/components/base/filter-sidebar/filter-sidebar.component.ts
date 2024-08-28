import {Component, EventEmitter, HostBinding, inject, OnChanges, OnInit, Output} from '@angular/core';
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAnglesLeft, faAnglesRight, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Tag, TagService} from "../../../service/tag.service";
import {ChipComponent} from "../../basic/chip/chip.component";
import {VisibilityEnum} from "../../../service/video.service";
import {NgClass, NgIf} from "@angular/common";
import {MatRipple} from "@angular/material/core"
import {MatBadge} from "@angular/material/badge"
import {UserService} from "../../../service/user.service"

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    IconButtonComponent,
    FaIconComponent,
    ChipComponent,
    NgClass,
    MatRipple,
    MatBadge,
    NgIf
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  protected readonly faSearch = faSearch;
  protected readonly faAnglesLeft = faAnglesLeft;

  @Output() updateFilterEmitter : EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  @HostBinding('class.open')
  sideBarOpen: boolean = true;

  tagService = inject(TagService);
  userService = inject(UserService);

  allTags : Tag[] = []
  selectedTags: Tag[] = []
  tagOptions: Tag[] = []

  ngOnInit() {
    this.getLocalStorageTags()

    this.sideBarOpen = localStorage.getItem("imaSidebarOpen") ? localStorage.getItem("imaSidebarOpen") === "true" : true;

    this.tagService.getAll().subscribe(tags => {
      this.allTags = tags;
      this.tagOptions = tags;
    });
  }

  generateTagOptions(query: string) {
    this.tagOptions = this.allTags.filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()) || this.selectedTags.includes(tag))
  }

  getLocalStorageTags(){
    let tags = localStorage.getItem("imaSelectedTags");
    if(tags){
      let json = JSON.parse(tags) as Tag[];
      json.forEach(tag => {
        this.updateFilter(tag, true);
      })
    }
  }

  setLocalStorageTags(){
    localStorage.setItem("imaSelectedTags", JSON.stringify(this.selectedTags));
  }

  updateFilter(tag: Tag, doNotEmit: boolean = false) {
    console.log("update " + tag.name)

    if (this.selectedTags.some(t => t.tagId === tag.tagId)) {
      this.selectedTags = this.selectedTags.filter(t => t.tagId !== tag.tagId);
    } else {
      this.selectedTags.push(tag);
    }

    this.setLocalStorageTags();

    if(!doNotEmit) {
      this.updateFilterEmitter.emit(this.selectedTags);
    }
  }

  isSelected(tag: Tag) {
    return this.selectedTags.some(t => t.tagId === tag.tagId);
  }

  toggleSidebar() {
    this.sideBarOpen = !this.sideBarOpen
    localStorage.setItem("imaSidebarOpen", this.sideBarOpen.toString());
  }
}
