import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category} from '../../models/category.model'; // Adjust the path as needed
import {environment} from '../../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiBaseUrl}/categories`; // Use environment variable for API URL
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(private http: HttpClient) {}

  // GET all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // GET category by ID
  getCategoryById(id: string): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Category>(url);
  }

  // POST create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, { headers: this.headers });
  }

  // PUT update an existing category (replace the entire category)
  updateCategory(id: string, category: Category): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Category>(url, category, { headers: this.headers });
  }

  // PATCH update part of a category (update some fields)
  patchCategory(id: string, category: Partial<Category>): Observable<Category> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<Category>(url, category, { headers: this.headers });
  }

  // DELETE a category by ID
  deleteCategory(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // GET count of categories
  getCategoryCount(): Observable<number> {
    const url = `${this.apiUrl}/count`;
    return this.http.get<{ count: number }>(url).pipe(
      map((response) => response.count)
    );
  }
}
