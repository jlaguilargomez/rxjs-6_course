import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, Observable, of, timer, noop } from 'rxjs';
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  // beginnerCourses: Course[];
  // advancedCourses: Course[];

  constructor() {}

  ngOnInit() {
    const http$: Observable<Course[]> = createHttpObservable('/api/courses');

    const courses$ = http$.pipe(
      tap(() => console.log('HTTP request executed')),
      map(res => Object.values(res['payload'])),
      // tslint:disable-next-line: max-line-length
      // OJO: si no lo entiendes, prueba a ejecutar el código sin el siguiente método y mira lo que devuelve por consola (se ejecutará dos veces)
      shareReplay()
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) => {
        return courses.filter((course: Course) => {
          return course.category === 'BEGINNER';
        });
      })
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => {
        return courses.filter((course: Course) => {
          return course.category === 'ADVANCED';
        });
      })
    );

    // courses$.subscribe(
    //   courses => {
    //     this.beginnerCourses = courses.filter(
    //       course => course.category === 'BEGINNER'
    //     );
    //     this.advancedCourses = courses.filter(
    //       course => course.category === 'ADVANCED'
    //     );
    //   },
    //   noop,
    //   () => console.log('completed')
    // );
  }
}
