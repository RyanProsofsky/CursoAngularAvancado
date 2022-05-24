import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from '../categories/shared/category.service';
import { Entry } from './shared/entry.model';

import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {
  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('https://p38yx781aa.execute-api.us-east-1.amazonaws.com/Stage/lancamentos', injector, Entry.fromJson)

  }

  //  apiPath: string = 'https://p38yx781aa.execute-api.us-east-1.amazonaws.com/Stage/lancamentos';
  // private user_id: string = 'ryan_prosofsky';


  // revisar
  create(entry: Entry): Observable<Entry> {
    return this.SetCategoryAndSendToServer(entry, super.create.bind(this))

  }

  update(entry: Entry): Observable<Entry> {
    return this.SetCategoryAndSendToServer(entry, super.update.bind(this))

  }

  private SetCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry)
      }),
      catchError(this.handleError)

    );
  }
}


