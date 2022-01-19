import {Type} from './bill';

export class Category {
  id: string;
  type: Type;
  name: string;
  monthlyIncome: number;
  monthlyOutcome: number;

  constructor(id: string, type: Type, name: string) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.monthlyIncome = 0;
    this.monthlyOutcome = 0;
  }

  resetMonthlyAmount(): void{
    this.monthlyIncome = 0;
    this.monthlyOutcome = 0;
  }
}
