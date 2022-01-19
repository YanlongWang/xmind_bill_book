import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Bill, Type} from '../bill';
import {Category} from '../category';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpApiService} from "../http/http-api.service";

@Component({
  selector: 'app-billbook',
  templateUrl: './billbook.component.html',
  styleUrls: ['./billbook.component.scss']
})
export class BillbookComponent implements OnInit , AfterViewInit{
  readonly MONTH_SELECTION = 'month';
  readonly TYPE_SELECTION = 'type';
  readonly CATEGORY_SELECTION = 'category';
  billArray: Bill[] = [];
  categoryArray: Category[] = [];
  inCategoryArray: Category[] = [];
  outCategoryArray: Category[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Bill> = new MatTableDataSource<Bill>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  months: any[] = [
    {name: '1月', value: '01'},
    {name: '2月', value: '02'},
    {name: '3月', value: '03'},
    {name: '4月', value: '04'},
    {name: '5月', value: '05'},
    {name: '6月', value: '06'},
    {name: '7月', value: '07'},
    {name: '8月', value: '08'},
    {name: '9月', value: '09'},
    {name: '10月', value: '10'},
    {name: '11月', value: '11'},
    {name: '12月', value: '12'}
  ];
  inOut: any[] = [{name: '收入', value: Type.IN}, {name: '支出', value: Type.OUT}];
  selectMonth: string;
  selectType: string;
  selectCategory: string;

  inMoneyByMonth: number;
  outMoneyByMonth: number;
  showInOutData: boolean;
  NO_SELECT: string;

  constructor(private http: HttpClient, private httpService: HttpApiService) {
    this.NO_SELECT = 'NO_SELECT';
    this.initVariables();
  }

  private initVariables(): void {
    this.inMoneyByMonth = 0;
    this.outMoneyByMonth = 0;
    this.showInOutData = false;
    this.selectMonth = this.NO_SELECT;
    this.selectType = this.NO_SELECT;
    this.selectCategory = this.NO_SELECT;
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
          this.categoryArray.forEach(category => {
            if (category.type === Type.IN) {
              this.inCategoryArray.push(category);
            } else {
              this.outCategoryArray.push(category);
            }
          });
          this.httpService.getBills()
            .subscribe(
              billData => {
                const csvBillToRowArray = billData.split('\n');
                for (let index = 0; index < csvBillToRowArray.length; index++) {
                  const row = csvBillToRowArray[index].split(',');
                  if (row.length !== 4) {
                    continue;
                  }
                  if (index === 0){
                    // first row assigned to display columns
                    this.displayedColumns = row;
                  } else {
                    const billTime = new Date(parseInt(row[1], 10)).toISOString();
                    const mappedCategory = this.categoryArray.filter(category => category.id === row[2])[0];
                    this.billArray.push(new Bill(row[0] === Type.OUT.toString() ? Type.OUT : Type.IN, billTime, mappedCategory, row[3]));
                  }
                }
                // Assign the data to the data source for the table to render
                this.dataSource.data = this.billArray;
                this.dataSource.sortingDataAccessor = this.addSorting();
                this.dataSource.filterPredicate = this.addFilter();
              },
              error => {
                console.log(error);
              }
            );
        },
        error => {
          console.log(error);
        }
      );
  }

  private addSorting(): any {
    return (item, property) => {
      switch (property) {
        case 'category':
          return item.category.name;
        case 'amount':
          return parseFloat(item.amount);
        default:
          return item[property];
      }
    };
  }

  private addFilter(): any {
    return (bill: Bill, filter: string) => {
      const isMonthNoSelect = this.NO_SELECT === this.selectMonth ;
      const isTypeNoSelect = this.NO_SELECT === this.selectType ;
      const isCategoryNoSelect = this.NO_SELECT === this.selectCategory ;
      let result;
      if (isMonthNoSelect && isTypeNoSelect && isCategoryNoSelect) {
        result = true;
      } else {
        let isResultMonth = bill.time.includes('-' + this.selectMonth + '-');
        let isResultType = this.selectType === bill.type + '';
        let isResultCategory = this.selectCategory === bill.category.id;
        if ( this.NO_SELECT === this.selectMonth) {
          isResultMonth = true;
        }
        if ( this.NO_SELECT === this.selectType) {
          isResultType = true;
        }
        if ( this.NO_SELECT === this.selectCategory) {
          isResultCategory = true;
        }
        result = isResultMonth && isResultType && isResultCategory;
      }
      if (isMonthNoSelect) {
        this.showInOutData = false;
      } else {
        this.showInOutData = true;
        // calculate by category
        if (bill.time.includes('-' + this.selectMonth + '-')) {
          const amountAdded = parseFloat(bill.amount);
          if (bill.type === Type.IN){
            this.inMoneyByMonth += amountAdded;
            bill.category.monthlyIncome += amountAdded;
          } else {
            this.outMoneyByMonth += amountAdded;
            bill.category.monthlyOutcome += amountAdded;
          }
          // sorting
          this.inCategoryArray.sort((cateA, cateB) => (cateB.monthlyIncome - cateA.monthlyIncome));
          this.outCategoryArray.sort((cateA, cateB) => (cateB.monthlyOutcome - cateA.monthlyOutcome));
        }
      }
      return result;
    };
  }

  changeSelection($event: Event, type: string): any{
    this.resetMonthlyData();
    const selectValue = ($event.target as any).value;
    if (type === this.MONTH_SELECTION) {
      this.selectMonth = selectValue;
    } else if (type === this.TYPE_SELECTION){
      this.selectType = selectValue;
    } else {
      this.selectCategory = selectValue;
    }
    this.dataSource.filter = selectValue;
  }

  private resetMonthlyData(): void{
    this.inMoneyByMonth = 0;
    this.outMoneyByMonth = 0;
    this.clearMonthlyAmount();
  }

  private clearMonthlyAmount(): void{
    this.categoryArray.forEach(category => category.resetMonthlyAmount());
  }

  public get type(): typeof Type {
    return Type;
  }

}
