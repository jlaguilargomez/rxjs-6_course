import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import {
  tap,
  map,
  shareReplay,
  retryWhen,
  delayWhen,
  filter
} from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload']))
        // shareReplay(),
        // retryWhen(errors => errors.pipe(delayWhen(() => timer(2000))))
      )
      .subscribe(courses => {
        return this.subject.next(courses);
      });
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCateggory('BEGINNER');
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCateggory('ADVANCED');
  }

  filterByCateggory(category: string) {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category))
    );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    // MODIFICAMOS LOS DATOS DEL STORE
    const courses = this.subject.getValue();

    const courseIndex = courses.findIndex(course => course.id === courseId);

    const newCourses = courses.slice(0);

    console.log(newCourses[courseIndex]);

    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    // REALIZAMOS LA PETICIÓN DE LOS CAMBIOS AL BACK
    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json'
        }
      })
    );
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id === courseId)),
      filter(course => !!course)
    );
  }
}
