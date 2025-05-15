import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Course } from '../models/course';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  scheduleService = inject(ScheduleService);
  schedule = signal<Course[]>([]);

  ngOnInit() {
    this.schedule.set(this.scheduleService.getSchedule());
  }

}
