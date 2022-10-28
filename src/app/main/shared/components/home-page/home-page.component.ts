import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  slides = [
    { image: '/assets/images/slide images/1.jpg' },
    { image: '/assets/images/slide images/2.jpg' },
    { image: '/assets/images/slide images/3.jpg' },
  ];


  constructor() { }

  ngOnInit() { }
}
