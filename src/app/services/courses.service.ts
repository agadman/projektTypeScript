import { HttpClient } from '@angular/common/http'; // Importerar HttpClient för att kunna hämta data via http
import { inject, Injectable } from '@angular/core';
import { Course } from '../models/course'; // Importerar kurs interface
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private url: string = "/miun_courses.json"; // Json-filen där all kursdata finns

  http = inject(HttpClient); // Hämtar httpClient

  // Laddar kurser från json filen
  async loadCourses(): Promise<Course[]> {
    const courses = this.http.get<Course[]>(this.url); // Gör ett get-anrop
    return await firstValueFrom(courses); // Väntar på svaret och returnerar det som en lista
  }
}
