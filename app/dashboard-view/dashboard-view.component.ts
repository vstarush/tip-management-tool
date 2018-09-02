import { Component, OnInit, OnDestroy, ElementRef } from 'angular2/core';
import { Router } from 'angular2/router';
import { AppService } from '../util/app.service';
import { Paycheck } from '../paycheck/paycheck';
import { PaycheckList } from '../paycheck-list/paycheck-list';
import { Invoice } from '../invoice/invoice';
import {Http, Headers, HTTP_PROVIDERS,Response} from 'angular2/http';


@Component({
  selector: 'dashboard-view',
  templateUrl: 'app/dashboard-view/dashboard-view.component.html',
  styleUrls:  ['app/dashboard-view/dashboard-view.component.css'],
  providers: [Paycheck,PaycheckList] 
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  datePickerStart:JQuery;
  datePickerEnd:JQuery;
  public currentDate:string;
  paychecks:Paycheck[] = [];
  
  constructor(
        public router:Router, 
        public appService:AppService,
        public elementRef:ElementRef,
        public http:Http,
        private paycheck:Paycheck,
        private paycheckList:PaycheckList
    ) { }

    
  ngOnInit(){
    //hide navbar collapse menu
    $(".navbar-toggle").not(".collapsed").click();

    this.currentDate = $.datepicker.formatDate( "D mm/dd/yy", new Date() );
    
    // Load paychecks from db
    this.paycheckList.loadPaycheckList()
      .then( paychecks => this.paychecks = paychecks )
      .catch(function(error) { console.log(error); });
  }

  showDatePickerStartDate(i:number):void {
    this.closeAllDatePickers();
    let datePickerStart = $(this.elementRef.nativeElement).find('.datepickerStartDate:eq('+i+')');
    datePickerStart.datepicker( {
        onSelect: (date)=> {
            this.setStartDate(date,i);
            datePickerStart.datepicker('destroy');
        }
    });
  }

  showDatePickerEndDate(i:number):void { 
    this.closeAllDatePickers();
    let minDate = this.paychecks[i].startDate;
    let datePickerEnd = $(this.elementRef.nativeElement).find('.datepickerEndDate:eq('+i+')');
    datePickerEnd
        // .datepicker( "option", "minDate", minDate )
        .datepicker('setDate', this.paychecks[i].endDate )
        .datepicker( {
          minDate:minDate,
          onSelect: (date)=> {
            this.setEndDate(date,i);
            datePickerEnd.datepicker('destroy');
        }
    });
  }

  setStartDate(newDate:string,i:number):void {
     this.paychecks[i].startDate =  new Date(newDate);
     this.paychecks[i].endDate =  this.plusTwoWeeks(newDate);
     this.paychecks[i].update();
     this.paycheckList.save(this.paychecks);
  }

  setEndDate(newDate:string,i:number):void {
    this.paychecks[i].endDate = new Date(newDate);
    this.paychecks[i].update();
    this.paycheckList.save(this.paychecks);
  }

  plusTwoWeeks(date:string):Date {
      var dateAfterTwoWeeks = new Date(date);
      dateAfterTwoWeeks.setDate(new Date(date).getDate() + 13);
      return dateAfterTwoWeeks;
  }

  createPaycheck():void {
    this.closeAllDatePickers();
    var newPaycheck = this.paycheck.newPaycheck();
    newPaycheck.overTime = Math.random()*100;
    this.paychecks.unshift(newPaycheck);
    this.paycheckList.save(this.paychecks);
  }

  deletePaycheck(i:number) {
    this.paychecks.splice(i,1);
    this.paycheckList.save(this.paychecks);
  }

  closeAllDatePickers():void {
    $(this.elementRef.nativeElement).find('.datepickerEndDate').datepicker().datepicker('destroy');
    $(this.elementRef.nativeElement).find('.datepickerStartDate').datepicker().datepicker('destroy');
  }

  bonusAfterTipOut(paycheck:Paycheck):string {
    if(!this.paycheck.totalBonus || this.paycheck.totalBonus==0 || !this.appService.isAdmin){
      return "";
    }else{
      return "/" + (this.paycheck.totalBonus + this.paycheck.tipsTakenHome); 
    }
  }

  ngOnDestroy() {}
}