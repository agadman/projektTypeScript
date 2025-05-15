import { Injectable } from '@angular/core';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private StorageKey = 'mySchedule';

  // Metoder
  getSchedule(): Course[] {
    const data = localStorage.getItem(this.StorageKey);
    return data ? JSON.parse(data) : [];
  } 

  addCourse(course: Course): void {
    const schedule = this.getSchedule();
    schedule.push(course);
    localStorage.setItem(this.StorageKey, JSON.stringify(schedule));
  }

  removeCourse(courseCode: string): void {
    const schedule = this.getSchedule();
    const updatedSchedule = schedule.filter(course => course.courseCode !== courseCode);
    localStorage.setItem(this.StorageKey, JSON.stringify(updatedSchedule)); 
  }

  clearSchedule(): void {
    localStorage.removeItem(this.StorageKey);
  }
}
