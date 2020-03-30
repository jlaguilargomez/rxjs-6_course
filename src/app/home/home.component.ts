import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, Observable, of, timer, noop, throwError } from 'rxjs';
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  finalize,
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
      catchError(
        err => {
          console.log('Error Ocurred', err);
          return throwError(err);
        }
        // of([
        //   {
        //     id: 0,
        //     description: 'RxJs In Practice Course',
        //     iconUrl:
        //       'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
        //     courseListIcon:
        //       'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
        //     longDescription:
        //       'Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples',
        //     category: 'BEGINNER',
        //     lessonsCount: 10,
        //   },
        // ])
      ),
      finalize(() => {
        console.log('Finalize exetuted');
      }),
      tap(() => console.log('HTTP request executed')),
      map(res => Object.values(res['payload'])),
      // tslint:disable-next-line: max-line-length
      // OJO: si no lo entiendes, prueba a ejecutar el código sin el siguiente método y mira lo que devuelve por consola (se ejecutará dos veces)
      shareReplay(),
      retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
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
