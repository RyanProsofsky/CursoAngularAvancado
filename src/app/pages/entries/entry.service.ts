import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators'

import { CategoryService } from '../categories/shared/category.service';

import { Entry } from './shared/entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'https://p38yx781aa.execute-api.us-east-1.amazonaws.com/Stage/lancamentos';
  private user_id: string = 'ryan_prosofsky';


  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]> {
    return this.http.get(this.apiPath, { params: { ['user_id']: this.user_id } }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url, { params: { ['user_id']: this.user_id } }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  // revisar
  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    )
  } 



  delete(id: string): Observable<any> {
    const url = `${this.apiPath}`;

    return this.http.delete(url, { params: { ['user_id']: this.user_id, ['id']: id } }).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[] {

    const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO =>", error);
    return throwError(error)
  }

}


