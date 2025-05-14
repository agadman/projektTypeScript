import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const routes: Routes = [
    { path: "Home", component: HomeComponent },
    { path: "Courses", component: CoursesComponent},
    { path: "Schedule", component: ScheduleComponent },
    { path: "", redirectTo: "Home", pathMatch: "full" }
];
