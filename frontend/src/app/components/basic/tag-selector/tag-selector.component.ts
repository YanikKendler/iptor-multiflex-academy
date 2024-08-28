import {Component, ElementRef, EventEmitter, inject, input, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Tag, TagService} from "../../../service/tag.service"
import {ChipComponent} from "../chip/chip.component"
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu"
import {MatButton} from "@angular/material/button"
import {ConfirmComponent} from "../../dialogue/confirm/confirm.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-tag-selector',
  standalone: true,
  imports: [
    ChipComponent,
    CdkMenuTrigger,
    CdkMenu,
    MatButton
  ],
  templateUrl: './tag-selector.component.html',
  styleUrl: './tag-selector.component.scss'
})
export class TagSelectorComponent implements OnInit{
  @Input() selectedTags: Tag[] = []
  @Output() selectedTagsChange = new EventEmitter<Tag[]>()

  readonly tagService = inject(TagService)

  @ViewChild(CdkMenuTrigger) tagPopupTrigger!: CdkMenuTrigger
  @ViewChild(CdkMenu) tagPopup!: CdkMenu
  @ViewChild("tagInput") tagInput!: ElementRef

  readonly dialogRef = inject(MatDialogRef<TagSelectorComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  allTags: Tag[] = []
  tagOptions: Tag[] = []

  ngOnInit(): void {
    this.tagService.getAll().subscribe(tags => {
      this.allTags = tags
    })
  }

  generateTagOptions(input: string) {
    this.tagOptions = this.allTags.filter(tag => !this.selectedTags.filter(t => t.tagId === tag.tagId).length)
    this.tagOptions = this.tagOptions.filter(tag => tag.name.toLowerCase().includes(input.toLowerCase()))
  }

  openTagPopup(){
    this.tagPopupTrigger.open()
  }

  createTag(name: string) {
    this.tagService.createTag(name).subscribe(tag => {
      this.addTag(tag)
    })
  }

  addTag(tag: Tag) {
    this.selectedTags.push(tag)
    this.selectedTagsChange.emit(this.selectedTags)
    this.tagInput.nativeElement.value = ""
    this.generateTagOptions("")
  }

  removeTag(tagToRemove: Tag){
    this.selectedTags = this.selectedTags.filter(tag => tag.tagId !== tagToRemove.tagId)
    this.generateTagOptions("")
    this.selectedTagsChange.emit(this.selectedTags)
  }

  deleteTag(tag: Tag) {
    this.dialog.open(ConfirmComponent, {
      height: "200px",
      width: "400px",
      data: {
        message: "Do really you want to delete this tag?"
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if(confirm) {
        this.tagService.deleteTag(tag.tagId).subscribe(() => {
          this.allTags = this.allTags.filter(t => t.tagId !== tag.tagId)
          this.tagOptions = this.tagOptions.filter(t => t.tagId !== tag.tagId)
        })
      }

      let value = this.tagInput.nativeElement.value
      this.tagInput.nativeElement.focus();
      this.generateTagOptions(value)
      this.openTagPopup()
    })
  }
}
