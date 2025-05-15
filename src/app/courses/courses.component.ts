import { Component, inject, signal } from '@angular/core';
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

  coursesService = inject(CoursesService);
  scheduleService = inject(ScheduleService)

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
  }

}
