import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-learning-path-icon',
  standalone: true,
  imports: [],
  templateUrl: './learning-path-icon.component.html',
  styleUrl: './learning-path-icon.component.scss'
})
export class LearningPathIconComponent {
  @Input() color: string = 'black';
}
