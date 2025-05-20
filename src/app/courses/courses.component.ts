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
  courses = signal<Course[]>([]); // Här sparas alla kurser
  error = signal<string | null>(null); // Här sparas eventuella felmeddelanden
  filterValue = signal<string>(''); // Här sparas det som skrivs i sökrutan
  selectedSubject = signal('Alla'); // Här sparas det valda ämnet, Alla är default

  // Hämtar mina services
  coursesService = inject(CoursesService);
  scheduleService = inject(ScheduleService)

  sortField = signal<keyof Course | null>(null); // För att spara sorteringsinställnmingar (både fält och riktning)
  sortDirection = signal<boolean>(true); // true = stigande, false = fallande

  // Funktion som filtrerar och sorterar kurserna
  filteredAndSortedCourses = computed(() => {
  const search = this.filterValue().toLowerCase();
  const selected = this.selectedSubject();
  const list = [...this.courses()];

  // 1. Filtrerar på sökord
  let filtered = list.filter(course =>
    course.courseName.toLowerCase().includes(search) ||
    course.courseCode.toLowerCase().includes(search)
  );

  // 2. Filtrerar på ämne (om inte "Alla" är valt)
  if (selected !== 'Alla') {
    filtered = filtered.filter(course => course.subject === selected);
  }

  // 3. Sorterar tabllen om ett fält är klickat på
  const field = this.sortField();
  const asc = this.sortDirection();

  if (!field) return filtered;

    // Sortering beroende av om fältet är string eller number
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
      this.sortDirection.set(!this.sortDirection()); // Detta byter riktning (om samma fält klickas)
    } else {
      this.sortField.set(field); // Nytt th klickas på
      this.sortDirection.set(true); // Börjar med stigande
    }
  }

  // Körs när komponenten laddas
  ngOnInit() {
    this.loadCourses();
  }

  // Här sparas listan med alla ämnen
  subjects = signal<string[]>([]);

  // Funktion för att ladda kurserna från json
  async loadCourses() {
    try {
      const response = await this.coursesService.loadCourses();
      this.courses.set(response);

      // Skapar en lista med unika ämnen
      const uniqueSubjects = Array.from(
        new Set(response.map(c => c.subject))
      ).sort();

      // Lägger till "Alla" först i listan
      this.subjects.set(['Alla', ...uniqueSubjects]);
    } catch (error) {
      // console.error(error)
      this.error.set("Kunde inte ladda kurser - försök igen senare.");
    }
  }

   // Metod för att lägga till en kurs schemat
    addToSchedule(course: Course) {
      this.scheduleService.addCourse(course);
      console.log(`Kursen ${course.courseCode} har lagts till i schemat!`);
      this.courses.set([...this.courses()]); // Tvingar uppdatering av listan
    }

    // Kollar om kursen redan finns i schemat
    isInSchedule(courseCode: string): boolean {
    return this.scheduleService.getSchedule().some(c => c.courseCode === courseCode);
  }
}