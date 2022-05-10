import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

import { Entry } from './../shared/entry.model';
import { EntryService } from '../entry.service';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';


import toastr from "toastr";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  entryForm: FormGroup;
  pageTitle: String | undefined;
  serverErrorMessages: string[] | undefined;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>

  // imaskConfig = {
  //   mask: Number,
  //   sacle: 2,
  //   thousandsSeparator: '',
  //   padFractionalZeros: true,
  //   normalizeZeros: true,
  //   radix: ','
  // };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }  


  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService


  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createEntry();
    else
      this.updateEntry();
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }


  // METODOS PRIVADOS 

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: ["true", [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry) // binds loaded entry data to EntryForm
          },
          (error) => alert('Ocorreu um erro no servidor tente mais tarde.')
        )
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )


  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Novo Lançamento"
    else {
      const entryName = this.entry.name || ""
      this.pageTitle = "Editando Categoria: " + entryName
    }
  }



  private createEntry() {
    let entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    entry.user_id = 'ryan_prosofsky';
    entry.id = Math.random().toString();


    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Category(),this.entryForm.value);
    entry.user_id = 'ryan_prosofsky';

    this.entryService.update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("entries", { skipLocationChange: true }).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    )
  }

  private actionsForError(error) {
    toastr.error("Ocorreu um  erro ao processar a sua solicitação!")

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde"]

  }
}


