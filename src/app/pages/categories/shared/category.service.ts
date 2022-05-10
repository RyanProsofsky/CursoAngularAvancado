import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators'

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'https://p38yx781aa.execute-api.us-east-1.amazonaws.com/Stage/categorias';
  private user_id: string = 'ryan_prosofsky';
  

  constructor(private http: HttpClient) { }

  // queryParamns

  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath, { params: { ['user_id']: this.user_id } }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url,{params: { ['user_id']: this.user_id}} ).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }
  // queryParamns

  // body
  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  // body
  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}`;

    return this.http.put(url,category).pipe(
      catchError(this.handleError),
      map(() => category)
    )
  }
 
  // params
  delete(id: string): Observable<any> { 
    const url = `${this.apiPath}`;

    return this.http.delete(url,{params: { ['user_id']: this.user_id,['id']: id}}).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // PRIVATE METHODS

  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO =>", error);
    return throwError(error)
  }

}
