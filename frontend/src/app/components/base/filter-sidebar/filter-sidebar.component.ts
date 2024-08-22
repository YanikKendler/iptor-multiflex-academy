import {Component, EventEmitter, inject, OnChanges, OnInit, Output} from '@angular/core';
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAnglesLeft, faAnglesRight, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Tag, TagService} from "../../../service/tag.service";
import {ChipComponent} from "../../basic/chip/chip.component";
import {VisibilityEnum} from "../../../service/video.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    IconButtonComponent,
    FaIconComponent,
    ChipComponent,
    NgClass
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  protected readonly faSearch = faSearch;
  protected readonly faAnglesLeft = faAnglesLeft;

  @Output() updateFilterEmitter : EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  isOpenState: boolean = true;

  tags : Tag[] = []
  tagService = inject(TagService);
  selectedTags: Tag[] = []

  constructor() {
    this.tagService.getAll().subscribe(tags => {
      this.tags = tags;
    });
  }

  protected readonly VisibilityEnum = VisibilityEnum;
  protected readonly faAnglesRight = faAnglesRight;

  ngOnInit() {
    this.getLocalStorageTags()
  }

  getLocalStorageTags(){
    let tags = localStorage.getItem("selectedTags");
    if(tags){
      let json = JSON.parse(tags) as Tag[];
      json.forEach(tag => {
        this.updateFilter(tag, true);
      })
    }
  }

  setLocalStorageTags(){
    localStorage.setItem("selectedTags", JSON.stringify(this.selectedTags));
  }

  updateFilter(tag: Tag, shouldNotEmit: boolean = false) {
    console.log("update " + tag.name)

    if (this.selectedTags.some(t => t.tagId === tag.tagId)) {
      this.selectedTags = this.selectedTags.filter(t => t.tagId !== tag.tagId);
    } else {
      this.selectedTags.push(tag);
    }

    this.setLocalStorageTags();

    if(!shouldNotEmit) {
      this.updateFilterEmitter.emit(this.selectedTags);
    }
  }

  isSelected(tag: Tag) {
    return this.selectedTags.some(t => t.tagId === tag.tagId);
  }
}
