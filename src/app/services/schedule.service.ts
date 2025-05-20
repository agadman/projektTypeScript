import { Injectable } from '@angular/core';
import { Course } from '../models/course'; // Importerar course-interfacet

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private StorageKey = 'mySchedule'; // Nyckeln som används för att spara schedule i localStorage

  // Hämtar schemat från localStorage
  getSchedule(): Course[] {
    const data = localStorage.getItem(this.StorageKey); 
    return data ? JSON.parse(data) : [];
  } 

  // Lägger till en kurs i schemat och sparar till localStorage
  addCourse(course: Course): void {
    const schedule = this.getSchedule();
    schedule.push(course);
    localStorage.setItem(this.StorageKey, JSON.stringify(schedule));
  }

  // Tar bort en kurs från schemat och sparar till localStorage
  removeCourse(courseCode: string): void {
    const schedule = this.getSchedule();
    const updatedSchedule = schedule.filter(course => course.courseCode !== courseCode);
    localStorage.setItem(this.StorageKey, JSON.stringify(updatedSchedule)); 
  }

  // Rensar hela schemat från localStorage
  clearSchedule(): void {
    localStorage.removeItem(this.StorageKey);
  }
}
