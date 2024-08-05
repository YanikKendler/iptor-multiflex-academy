import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavigationComponent} from "../navigation/navigation.component"
import {StarIconComponent} from "../icons/star/star.icon.component"
import {BookmarkIconComponent} from "../icons/bookmark/bookmark.icon.component"

@Component({
  selector: 'app-view-video',
  standalone: true,
  imports: [
    NavigationComponent,
    StarIconComponent,
    BookmarkIconComponent
  ],
  templateUrl: './view-video.component.html',
  styleUrl: './view-video.component.scss'
})
export class ViewVideoComponent implements AfterViewInit{
  title: string = 'Video Title';
  description: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt iste iusto laudantium tempora! Debitis iure, quo. Accusamus ad adipisci alias amet assumenda, commodi consequuntur dolore est ex excepturi fugit impedit ipsa ipsum iste itaque labore laudantium minus molestias natus nesciunt nihil nostrum officiis pariatur quam quibusdam reprehenderit saepe sed temporibus ullam ut. Accusamus beatae deleniti dignissimos doloremque dolores dolorum ea, et eveniet exercitationem expedita, explicabo id impedit libero magni maiores modi nam natus nulla obcaecati optio, placeat quaerat quisquam quo vero voluptate voluptates voluptatum? Ab itaque quia unde? A alias autem dolore ducimus tenetur. Amet distinctio exercitationem quaerat rem ullam!';

  markerPos = {width: 0, left: 0}

  @ViewChild('tabSelector') tabSelector: ElementRef | undefined;

  selectTab(tab: "comments" | "quiz"){
    let tabElement: HTMLElement
    if(tab === "comments"){
      tabElement = this.tabSelector?.nativeElement.querySelector('.comments') as HTMLElement
    } else {
      tabElement = this.tabSelector?.nativeElement.querySelector('.quiz') as HTMLElement
    }
    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.selectTab("comments")
  }
}
