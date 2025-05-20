import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const routes: Routes = [
    // Definierar rutterna och omdirgirgerar till Home om ingen rutt är angiven
    { path: "home", component: HomeComponent },
    { path: "courses", component: CoursesComponent},
    { path: "schedule", component: ScheduleComponent },
    { path: "", redirectTo: "home", pathMatch: "full" }
];
