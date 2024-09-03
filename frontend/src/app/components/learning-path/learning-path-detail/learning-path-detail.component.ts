import {AfterViewInit, Component, ElementRef, inject, OnChanges, OnInit, ViewChild} from '@angular/core';
import {LearningPathDetailDTO, LearningPathEntryDTO, LearningPathService} from "../../../service/learning-path.service";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
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
import {MatButton} from "@angular/material/button";
import {Config} from "../../../config"
import {faArrowLeft, faBars} from "@fortawesome/free-solid-svg-icons"
import {MatTooltip} from "@angular/material/tooltip"

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
    RouterLink,
    MatButton,
    MatTooltip
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

  protected videoService = inject(VideoService)
  protected userService = inject(UserService)
  protected viewProgressService = inject(ViewProgressService)

  service = inject(LearningPathService)
  learningPath : LearningPathDetailDTO = {} as LearningPathDetailDTO

  currentVideoPosition : number = 0
  currentVideo : VideoDetailDTO = {} as VideoDetailDTO
  progressPercent : number = 0

  isLastVideo: boolean = false
  isFinished: boolean = false

  //wheter or not the full learning path description is shown in the sidebar
  fullDescription: boolean = false

  //sidebar should only be closable on small screens: if screen is small(true) sidebar is closed(open = false)
  sidebarOpen: boolean = !Config.SMALL_SCREEN

  constructor(private route: ActivatedRoute, private router: Router) {  }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      if(user.userId <= 0) return

      this.route.params.subscribe(
        (params: Params) => {
          this.service.getLearningPathDetails(params['id']).subscribe(learningPath => {
            if(learningPath == null){
              this.router.navigate(['error/404'])
              return
            }

            this.learningPath = learningPath

            this.generateConfetti()

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

    if(!this.canvasRef) return

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext("2d")!;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
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
        this.generateConfetti();
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
  maxConfettis = 100;
  particles: any[] = [];
  possibleColors = [
    "hsl(31, 100%, 47%)"
  ];

  generateConfetti() {
    if(!this.canvas) return

    if(this.learningPath.color != undefined) {
      this.possibleColors = [
        this.learningPath.color,
        Utils.shiftHexColorLightness(this.learningPath.color, 10),
        Utils.shiftHexColorLightness(this.learningPath.color, 30),
        Utils.shiftHexColorLightness(this.learningPath.color, 60),
        Utils.shiftHexColorLightness(this.learningPath.color, -10),
        Utils.shiftHexColorLightness(this.learningPath.color, -30),
        Utils.shiftHexColorLightness(this.learningPath.color, -60),
      ]
    }

    for (let i = 0; i < this.maxConfettis; i++) {
      this.particles.push(this.generateConfettiParticle());
    }

    console.log(this.particles)

    this.drawConfetti()
  }

  randomFromTo(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  generateConfettiParticle() {
    return {
      x: Math.random() * this.W,
      y: Math.random() * this.H - this.H,
      r: this.randomFromTo(11, 33),
      d: Math.random() * this.maxConfettis + 11,
      color: this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)],
      tilt: Math.floor(Math.random() * 33) - 11,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    }
  }

  drawConfetti() {
    if (!this.context) {
      console.error('Canvas context is not initialized.');
      return;
    }

    requestAnimationFrame(() => this.drawConfetti());
    this.context.clearRect(0, 0, this.W, window.innerHeight);

    let particle: any;
    let remainingFlakes = 0;
    for (let i = 0; i < this.maxConfettis; i++) {
      particle = this.particles[i];
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

      this.context.beginPath();
      this.context.lineWidth = particle.r / 2;
      this.context.strokeStyle = particle.color;
      this.context.moveTo(particle.x + particle.tilt + particle.r / 3, particle.y);
      this.context.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.r / 5);
      this.context.stroke();

      if (particle.y <= this.H) remainingFlakes++;

      if (particle.x > this.W + 30 || particle.x < -30 || particle.y > this.H) {
        particle.x = Math.random() * this.W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }
  }

  approvePath() {
    this.userService.approveContent(this.learningPath.contentId).subscribe(response =>{
      this.learningPath.approved = true
    })
  }

  protected readonly faCircleCheck = faCircleCheck
  protected readonly Utils = Utils
  protected readonly faFaceLaughBeam = faFaceLaughBeam
  protected readonly Config = Config
  protected readonly faBars = faBars
  protected readonly faArrowLeft = faArrowLeft
}
