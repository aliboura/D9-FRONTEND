import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html'
})
export class HelpsComponent implements OnInit {
  video1: string;
  video2: string;
  video3: string;
  video4: string;
  video5: string;
  video6: string;
  video7: string;
  video8: string;
  video9: string;

  constructor() {
  }

  ngOnInit() {
    this.video1 = "./assets/videos/video1";
    this.video2 = "./assets/videos/video2";
    this.video3 = "./assets/videos/video3";
    this.video4 = "./assets/videos/video4";
    this.video5 = "./assets/videos/video5";
    this.video6 = "./assets/videos/video6";
    this.video7 = "./assets/videos/video7";
    this.video8 = "./assets/videos/video8";
    this.video9 = "./assets/videos/video9";
  }

}
