import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TagService} from "./service/tag.service";
import {VideoModel} from "./model/VideoModel";
import {VideoService} from "./service/video.service";
import {TagModel} from "./model/TagModel";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent{
}
