import {Category} from './category';

export enum Type{
  OUT,
  IN
}
export class Bill {
  type: Type;
  time: string;
  category: Category;
  amount: string;

  constructor(type: Type, time: string, category: Category, amount: string) {
    this.type = type;
    this.time = time;
    this.category = category;
    this.amount = amount;
  }
}
