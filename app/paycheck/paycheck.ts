import { Directive, Component, Input } from 'angular2/core';
import { Http, Headers, HTTP_PROVIDERS, Response } from 'angular2/http';
import { AppService,CurrentDate } from '../util/app.service';
import 'rxjs/Rx';
import { Invoice } from '../invoice/invoice';

//Default constants
//Hours after standartWorkingDay will count like overtime
const standartWorkingDay:number = 8;
const standartRate:number = 12.25;
const overtimeRate:number = 18.38;
    
@Component({
  providers: [Invoice,Http]
})
////////////////////////////////////////////////////////////////////////////////////////
//Paycheck is your summary for current period of time
//by default period is 2 weeks
//in calculate() calculates all data for every filled invoice for selected period
////////////////////////////////////////////////////////////////////////////////////////
export class Paycheck {
   
    private invoices:Invoice[];
    startDate: Date = CurrentDate;
    endDate: Date = this.datePlusTwoWeeks();
    hrly: number;
    hrlyHours: number;
    overTime: number;
    overTimeHours: number;
    declaredTips: number;
    paidOutTips:number;
    tipsTakenHome: number;
    totalBonus: number;

  constructor(private http:Http){
    this.setDefaults();
    this.update();
  }
  
  newPaycheck():Paycheck{
      return new Paycheck(this.http);
  }
  
  newPaycheckWithDateRange(dateRange:{startDate;endDate}):Paycheck{
      let newPaycheck:Paycheck = new Paycheck(this.http);
      newPaycheck.setDateRange(dateRange);
      return newPaycheck;
  }
  
  setDefaults():void {
    this.hrly = 0;
    this.hrlyHours = 0;
    this.overTime = 0;
    this.overTimeHours = 0;
    this.declaredTips = 0;
    this.paidOutTips = 0;
    this.tipsTakenHome = 0;
    this.totalBonus = 0;
  }
  
  setDateRange(dateRange:{startDate;endDate}):void{
      this.startDate = dateRange.startDate;
      this.endDate = dateRange.endDate;
      this.update();
  }
  
  formatedStartDate():string{
      return this.formatedDate(this.startDate);
  }
  
  formatedEndDate():string{
      return this.formatedDate(this.endDate);
  }
  
  //Date format to show on screen fields
  formatedDate(date:Date):string{
      return $.datepicker.formatDate( "D mm/dd/yy", new Date(date.toDateString()));
  }
  
  datePlusTwoWeeks():Date {
      //Make copy of CurrentDate
      var dateAfterTwoWeeks:Date = new Date(CurrentDate.toDateString());
      dateAfterTwoWeeks.setDate(new Date().getDate() + 13);
      return dateAfterTwoWeeks;
  }
  
  update():void{
      this.loadInvoices();   
  }
  
  loadInvoices():void{
     let rangeStartDate:Date = this.startDate;
     let rangeEndDate:Date = this.endDate;
  
     //if wrong date range return defaults
     if(rangeStartDate > rangeEndDate) {
         this.setDefaults();
         return;
     }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let urlStartDate = encodeURI($.datepicker.formatDate( "mm-dd-yy", rangeStartDate ));
        let urlEndDate = encodeURI($.datepicker.formatDate( "mm-dd-yy", rangeEndDate ));
        this.http.get('/api/v1/invoice-range/'+urlStartDate+":"+urlEndDate, {
                headers: headers
        })
        .map(response => response.json())
        .subscribe(
            data => {
                this.loadInvoicesFromJson(data);
            },
            err => console.log(err.json().message),
            () => {}
        );
 }
 
 calculate():void{
     this.setDefaults();
     for(let i=0; i<this.invoices.length; i++){
         this.declaredTips += this.invoices[i].declaredTips;
         this.tipsTakenHome += this.invoices[i].afterTipOut;
         this.totalBonus += this.invoices[i].bonus;
     }
 }
  
 loadInvoicesFromJson(data:any){
      this.invoices = data;
      this.calculate();
  }
  
}

