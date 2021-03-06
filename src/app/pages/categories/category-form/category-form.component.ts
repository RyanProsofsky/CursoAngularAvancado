import { Category } from './../shared/category.model';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";


import { CategoryService } from '../shared/category.service';



import toastr from "toastr";
import { switchMap } from 'rxjs/internal/operators/switchMap';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string | undefined;
  categoryForm!: FormGroup;
  pageTitle: String | undefined;
  serverErrorMessages: string[] | undefined;
  submittingForm: boolean = false;
  category: Category = new Category()
  params: any



  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private FormBuilder: FormBuilder


  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new")
      this.createCategory();
    else
      this.updateCategory();

  }
  // METODOS PRIVADOS 

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"
  }

  private buildCategoryForm() {
    this.categoryForm = this.FormBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category) // binds loaded category data to CategoryForm
          },
          (error) => alert('Ocorreu um erro no servidor tente mais tarde.')
        )
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de Nova Categoria"
    else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName
    }
  }



  private createCategory() {
    let category: Category = Object.assign(new Category(), this.categoryForm.value);
    category.user_id = 'ryan_prosofsky';
    category.id = Math.random().toString();

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory() {
    let category: Category = Object.assign(new Category(), this.categoryForm.value);
    category.user_id = 'ryan_prosofsky';
   

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicita????o processada com sucesso!");

    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    )
  }

  private actionsForError(error) {
    toastr.error("Ocorreu um  erro ao processar a sua solicita????o!")

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunica????o com o servidor. Por favor, tente mais tarde"]

  }
}