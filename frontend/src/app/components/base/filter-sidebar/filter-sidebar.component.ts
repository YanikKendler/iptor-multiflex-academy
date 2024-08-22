import {Component, EventEmitter, inject, Output} from '@angular/core';
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faAnglesLeft, faAnglesRight, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Tag, TagService} from "../../../service/tag.service";
import {ChipComponent} from "../../basic/chip/chip.component";
import {VisibilityEnum} from "../../../service/video.service";

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    IconButtonComponent,
    FaIconComponent,
    ChipComponent
  ],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
  protected readonly faSearch = faSearch;
  protected readonly faAnglesLeft = faAnglesLeft;

  @Output() updateFilterEmitter : EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  isOpenState: boolean = true;

  tags : Tag[] = []
  tagService = inject(TagService);
  visibilityTypes = Object.values(VisibilityEnum);
  selectedTags: Tag[] = []

  constructor() {
    this.tagService.getAll().subscribe(tags => {
      this.tags = tags;
      console.log(this.tags)
    });
  }

  protected readonly VisibilityEnum = VisibilityEnum;
  protected readonly faAnglesRight = faAnglesRight;

  toggleSelect(event: Event | null) {
    (event?.target as HTMLElement).classList.toggle('selected');
  }

  updateFilter(tag: Tag) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }

    this.updateFilterEmitter.emit(this.selectedTags)
  }
}
