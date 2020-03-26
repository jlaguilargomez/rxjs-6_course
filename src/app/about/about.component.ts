import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, fromEvent, Observable, noop } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
