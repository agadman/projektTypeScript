import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../models/course';
import { CoursesService } from '../services/courses.service';
import { ScheduleService } from '../services/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  imports: [CommonModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courses = signal<Course[]>([]); 
  error = signal<string | null>(null);
  filterValue = signal<string>('');

  coursesService = inject(CoursesService);
  scheduleService = inject(ScheduleService)

  sortField = signal<keyof Course | null>(null);
  sortDirection = signal<boolean>(true);

  sortedCourses = computed(() => {
    const list = [...this.courses()];
    const field = this.sortField();
    const asc = this.sortDirection();

    if (!field) return list;

    return list.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return asc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return asc ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  });

  // Metod för att hantera när en th klickas på (kod, namn eller progression)
  setSort(field: keyof Course) {
    if (this.sortField() === field) {
      this.sortDirection.set(!this.sortDirection()); // Byt riktning (om samma fält klickas)
    } else {
      this.sortField.set(field); // Nytt th klickas på
      this.sortDirection.set(true); // Börjar med stigande
    }
  }

  ngOnInit() {
    this.loadCourses();
  }

  async loadCourses() {
    try {
      const response = await this.coursesService.loadCourses();
      this.courses.set(response);
      console.table(this.courses());
    } catch (error) {
      //console.error(error);
      this.error.set("Kunde inte ladda kurser - försök igen senare.");
    }
  }

  addToSchedule(course: Course) {
    this.scheduleService.addCourse(course);
    console.log(`Kursen ${course.courseCode} har lagts till i schemat!`);
    this.courses.set([...this.courses()]);
  }

  isInSchedule(courseCode: string): boolean {
  return this.scheduleService.getSchedule().some(c => c.courseCode === courseCode);
}

}
