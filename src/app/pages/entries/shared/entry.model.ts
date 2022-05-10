import { Category } from './../../categories/shared/category.model';

export class Entry {
  static id: any;
  entry: any;
    constructor(
        public user_id?:string,
        public id?: string, 
        public name?: string, 
        public description?: string, 
        public type?: string, 
        public amount?: string, 
        public date?: string, 
        public paid?: boolean, 
        public categoryId?: number, 
        public category?: Category
    ){}



  static types = {
      expense: 'Despesa',
      revenue: 'Receita'
  }

  get paidText(): string {
      return this.paid ? 'Pago' : 'Pendente';
  }
}