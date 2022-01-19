import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Bill, Type} from '../../bill';
import {Category} from '../../category';
import {HttpClient} from '@angular/common/http';
import {HttpApiService} from '../../http/http-api.service';

@Component({
  selector: 'app-addbill',
  templateUrl: './addbill.component.html',
  styleUrls: ['./addbill.component.scss']
})
export class AddbillComponent implements OnInit {

  inOut: any[] = [{name: '收入', value: Type.IN}, {name: '支出', value: Type.OUT}];
  categoryArray: Category[] = [];
  inCategoryArray: Category[] = [];
  outCategoryArray: Category[] = [];
  bill: Bill;
  amountPattern: string;

  addBillFormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required)
    });

  constructor(private http: HttpClient, private httpService: HttpApiService) {
    this.bill = new Bill(null, '', new Category('', null, ''), '') ;
    this.amountPattern = '^\\d+(.\\d{2}|\\d*)$';
  }

  ngOnInit(): void {
    // load data
    this.httpService.getCategories()
      .subscribe(
        data => {
          const csvToRowArray = data.split('\n');
          for (let index = 1; index < csvToRowArray.length; index++) {
            const row = csvToRowArray[index].split(',');
            this.categoryArray.push(new Category(row[0], row[1] === Type.OUT.toString() ? Type.OUT : Type.IN, row[2]));
          }
          console.log(this.categoryArray);
          this.categoryArray.forEach(category => {
            if (category.type === Type.IN) {
              this.inCategoryArray.push(category);
            } else {
              this.outCategoryArray.push(category);
            }
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  onSubmit(): void {
    const bill = this.addBillFormGroup.value;
    bill.time = new Date().getTime();
    bill.amount = parseFloat(bill.amount) + '';
    this.httpService.addBill(JSON.stringify(bill)).subscribe(result => {
      if (result.result === '1'){
        alert('添加成功！');
      } else {
        alert('添加失败！！');
      }
      this.bill.type = null;
      this.reset();
    });
  }

  reset(): void{
    this.addBillFormGroup.reset();
  }

  changeType($event: Event): void{
    const type = ($event.target as any).value;
    if (type) {
      this.bill.type = type === '0' ? 0 : 1;
    } else {
      this.bill.type = null;
    }
  }

  public get type(): typeof Type {
    return Type;
  }

  get amount(): FormControl{
    return this.addBillFormGroup.get('amount') as FormControl;
  }
}
