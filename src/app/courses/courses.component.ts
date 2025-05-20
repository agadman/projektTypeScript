import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../models/course';
import { CoursesService } from '../services/courses.service';
import { ScheduleService } from '../services/schedule.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courses = signal<Course[]>([]); 
  error = signal<string | null>(null);
  filterValue = signal<string>('');
  selectedSubject = signal('Alla');

  coursesService = inject(CoursesService);
  scheduleService = inject(ScheduleService)

  sortField = signal<keyof Course | null>(null);
  sortDirection = signal<boolean>(true);

  filteredAndSortedCourses = computed(() => {
  const search = this.filterValue().toLowerCase();
  const selected = this.selectedSubject();
  const list = [...this.courses()];

  // 1. Filtrera på sökord
  let filtered = list.filter(course =>
    course.courseName.toLowerCase().includes(search) ||
    course.courseCode.toLowerCase().includes(search)
  );

  // 2. Filtrera på ämne (om inte "Alla" är valt)
  if (selected !== 'Alla') {
    filtered = filtered.filter(course => course.subject === selected);
  }

  // 3. Sortera
  const field = this.sortField();
  const asc = this.sortDirection();

  if (!field) return filtered;

  return filtered.sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return asc ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
});

  // Signal för att räkna ihop totalt antal kurser som visas i tabellen
  totalCourseCount = computed(() => { 
    return this. filteredAndSortedCourses().length 
  });

  // Metod för att hantera när en th klickas på (kod, namn, poäng eller ämne)
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

 subjects = signal<string[]>([]);

async loadCourses() {
  try {
    const response = await this.coursesService.loadCourses();
    this.courses.set(response);

    // Hämta unika ämnen och sortera dem
    const uniqueSubjects = Array.from(
      new Set(response.map(c => c.subject))
    ).sort();

    // Lägg till "Alla" överst
    this.subjects.set(['Alla', ...uniqueSubjects]);
  } catch (error) {
    // console.error(error)
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
