import {AfterViewInit, Component, ElementRef, inject, OnChanges, OnInit, ViewChild} from '@angular/core';
import {LearningPathDetailDTO, LearningPathEntryDTO, LearningPathService} from "../../../service/learning-path.service";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {MediaPlayerComponent} from "../../basic/media-player/media-player.component";
import {VideoDetailDTO, VideoService} from "../../../service/video.service";
import {BookmarkIconComponent} from "../../icons/bookmark/bookmark.icon.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconButtonComponent} from "../../basic/icon-button/icon-button.component";
import {VideoRatingComponent} from "../../video/video-rating/video-rating.component";
import {VideoCommentContainerComponent} from "../../video/video-comment-container/video-comment-container.component";
import {VideoQuizComponent} from "../../video/video-quiz/video-quiz.component";
import {NavigationComponent} from "../../base/navigation/navigation.component";
import {NgClass, NgStyle} from "@angular/common";
import {PlayIconComponent} from "../../icons/playicon/play.icon.component"
import {faCircleCheck, faFaceLaughBeam} from "@fortawesome/free-regular-svg-icons"
import {UserService} from "../../../service/user.service"
import {Utils} from "../../../utils"
import {ViewProgressService} from "../../../service/view-progress.service";

@Component({
  selector: 'app-learning-path-detail',
  standalone: true,
  imports: [
    MediaPlayerComponent,
    BookmarkIconComponent,
    FaIconComponent,
    IconButtonComponent,
    VideoRatingComponent,
    VideoCommentContainerComponent,
    VideoQuizComponent,
    NavigationComponent,
    NgClass,
    NgStyle,
    PlayIconComponent,
    RouterLink
  ],
  templateUrl: './learning-path-detail.component.html',
  styleUrl: './learning-path-detail.component.scss'
})
export class LearningPathDetailComponent implements OnInit, AfterViewInit{
  @ViewChild('tabSelector')
  set pane(selector: ElementRef) {
    setTimeout(() => {
      this.tabSelector = selector?.nativeElement
      if(this.tabSelector != undefined) this.selectTab("description")
    }, 0);
  }
  tabSelector: HTMLElement | undefined

  @ViewChild('canvas') canvasRef: ElementRef | undefined;

  currentTab : "description" | "comments" = "description"
  markerPos = {width: 0, left: 0}

  videoProgress: number[] = []

  service = inject(LearningPathService)
  learningPath : LearningPathDetailDTO = {} as LearningPathDetailDTO

  currentVideoPosition : number = 0
  currentVideo : VideoDetailDTO = {} as VideoDetailDTO
  progressPercent : number = 0

  isLastVideo: boolean = false
  isFinished: boolean = false

  videoService = inject(VideoService)
  userService = inject(UserService)
  viewProgressService = inject(ViewProgressService)

  //wheter or not the full learning path description is shown in the sidebar
  fullDescription: boolean = false

  constructor(private route: ActivatedRoute) {  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if(user.userId <= 0) return

      this.route.params.subscribe(
        (params: Params) => {
          this.service.getLearningPathDetails(params['id']).subscribe(learningPath => {
            this.learningPath = learningPath

            if(this.learningPath.viewProgress){
              this.progressPercent = this.learningPath.viewProgress.progress / this.learningPath.entries.length * 100
            } else {
              this.viewProgressService.updateViewProgress(this.learningPath!.contentId, 0).subscribe(value => {
                this.learningPath.viewProgress = value
              })
            }

            for (let i = 1; i <= this.learningPath.entries.length; i++) {
              this.videoProgress.push(i)
            }

            if(this.progressPercent == 100){
              this.isFinished = true
              this.currentVideoPosition = this.learningPath.entries.length
            } else{
              this.getVideoDetails(this.learningPath.entries[this.learningPath.viewProgress ? this.learningPath.viewProgress.progress : 0].videoId)
            }
          })
        }
      )
    })
  }

  getVideoDetails(videoId: number){
    this.videoService.getVideoDetails(videoId).subscribe(video => {
      this.currentVideo = video
      this.currentVideoPosition = this.learningPath.entries.findIndex(entry => entry.videoId == videoId)
    })
  }

  getProgressBarColor(number: number): string {
    if(this.learningPath.viewProgress && number <= this.learningPath.viewProgress.progress && this.learningPath.color){
      return this.learningPath.color
    } else{
      return "hsl(0, 0%, 69%)"
    }
  }

  selectTab(tab: "description" | "comments"){
    this.currentTab = tab
    let tabElement: HTMLElement

    if(tab === "comments"){
      tabElement = this.tabSelector?.querySelector('.comments') as HTMLElement
    } else {
      tabElement = this.tabSelector?.querySelector('.description') as HTMLElement
    }

    let marker = this.tabSelector?.querySelector('.marker') as HTMLElement
    if(marker == null || tabElement == null) return
    marker.style.width = tabElement.clientWidth - 16 + "px"
    marker.style.left = tabElement.offsetLeft + 8 + "px"

    this.markerPos = {width: tabElement.clientWidth, left: tabElement.offsetLeft}
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    })

    console.log(this.canvasRef)
    if(!this.canvasRef) return

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.width = this.W;
    this.canvas.height = this.H;

    this.getConfetti();
  }

  generateDescriptionWithLinebreaks(){
    if(!this.currentVideo.description) return ""
    return this.currentVideo.description.replace(/\n/g, "<br>")
  }

  getClassAvailability(video: LearningPathEntryDTO | undefined): string {
    if(video == undefined) {
      if(this.isFinished && this.currentVideoPosition == this.learningPath.entries.length){
        return 'active'
      }
      return 'available'
    } else if(this.currentVideo.contentId == video.videoId && this.currentVideoPosition != this.learningPath.entries.length){
      return 'active'
    } else if(this.learningPath.viewProgress && video.entryPosition <= this.learningPath.viewProgress.progress + 1){
      return 'available'
    } else {
      return 'unavailable'
    }
  }

  selectVideo(video: LearningPathEntryDTO | undefined) {
    if(video == undefined) {
      this.currentVideoPosition = this.learningPath.entries.length; return
    }
    this.getVideoDetails(video.videoId)
  }

  nextVideo() {
    let currentId = this.currentVideo.contentId

    if(this.isFinished){
      this.currentVideoPosition = this.learningPath.entries.length; return
    }

    if(this.learningPath.viewProgress && currentId == this.learningPath.entries[this.learningPath.viewProgress.progress].videoId){
      this.learningPath.viewProgress.progress++
      this.progressPercent = this.learningPath.viewProgress.progress / this.learningPath.entries.length * 100

      if(this.learningPath.viewProgress.progress < this.learningPath.entries.length){
        this.getVideoDetails(this.learningPath.entries[this.learningPath.viewProgress.progress].videoId)
      } else {
        this.currentVideoPosition++
        this.isFinished = true
        this.getConfetti();
        this.userService.finishAssignedContent(this.learningPath.contentId).subscribe()
      }

      if(this.learningPath.viewProgress.progress == this.learningPath.entries.length - 1){
        this.isLastVideo = true
      }

      this.service.nextVideoForLearningPath(this.learningPath.contentId)
    } else{
      this.getVideoDetails(++this.currentVideoPosition)
    }
  }

  W!: number;
  H!: number;
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  maxConfettis = 150;
  particles: any[] = [];
  possibleColors = [
    "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"
  ];

  getConfetti() {
    console.log(this.canvas)
    console.log("getConfetti")
    if(!this.canvas) return

    for (let i = 0; i < this.maxConfettis; i++) {
      this.particles.push(this.confettiParticle());
    }
    this.Draw()
  }

  randomFromTo(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  confettiParticle() {
    const x = Math.random() * this.W;
    const y = Math.random() * this.H - this.H;
    const r = this.randomFromTo(11, 33);
    const d = Math.random() * this.maxConfettis + 11;
    const color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
    const tilt = Math.floor(Math.random() * 33) - 11;
    const tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    const tiltAngle = 0;

    return {
      x,y,r,d,
      color,
      tilt,
      tiltAngleIncremental,
      tiltAngle,
      draw: () => {
        this.context.beginPath();
        this.context.lineWidth = r / 2;
        this.context.strokeStyle = color;
        this.context.moveTo(x + tilt + r / 3, y);
        this.context.lineTo(x + tilt, y + tilt + r / 5);
        return this.context.stroke();
      }
    };
  }

  Draw() {
    if (!this.context) {
      console.error('Canvas context is not initialized.');
      return;
    }

    requestAnimationFrame(() => this.Draw());
    this.context.clearRect(0, 0, this.W, window.innerHeight);

    let particle: any;
    let remainingFlakes = 0;
    for (let i = 0; i < this.maxConfettis; i++) {
      particle = this.particles[i];
      particle.draw()
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      if (particle.y <= this.H) remainingFlakes++;

      if (particle.x > this.W + 30 || particle.x < -30 || particle.y > this.H) {
        particle.x = Math.random() * this.W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }
  }


  protected readonly faCircleCheck = faCircleCheck
  protected readonly Utils = Utils
  protected readonly faFaceLaughBeam = faFaceLaughBeam
}
