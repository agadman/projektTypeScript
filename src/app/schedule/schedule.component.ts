import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Course } from '../models/course'; //Imorterar kurs interfacet
import { ScheduleService } from '../services/schedule.service'; // Importerar services som hanterar schemat

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  scheduleService = inject(ScheduleService); // Hämtar schema servicen
  schedule = signal<Course[]>([]); // Signal för att spara kurserna i schemat

  // Beräknar total poäng av kurserna i schemat
  totalPoints = computed(() => {
    return this.schedule().reduce((acc, course) => acc + course.points, 0);
  })

  // Körs när komponenten laddas (Hämtar schemat fron servicen)
  ngOnInit() {
    this.schedule.set(this.scheduleService.getSchedule());
  }

  // Tar bort en kurs från schemat baserat på kurskoden
  removeCourse(courseCode: string) {
    this.scheduleService.removeCourse(courseCode); // Tar bort från servicen
    this.schedule.set(this.scheduleService.getSchedule()); // Uppdaterar schemat
    console.log(`Kursen ${courseCode} har tagits bort från schemat!`);
  }

  // Tar bort alla kurser från schemat
  clearSchedule() {
    this.scheduleService.clearSchedule(); // Tömmer schemat i servicen
    this.schedule.set([]); // Tömmer hela listan
    console.log(`Schemat har rensats!`);
  }

}
