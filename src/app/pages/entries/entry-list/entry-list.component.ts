import { Component } from '@angular/core';

import { BaseResourceListComponent } from 'src/app/shared/components/base.resource-list.component.ts/base-resource-list.component';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../entry.service'; 

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {

  constructor(private entryService: EntryService) { 
    super(entryService)
  }

}
