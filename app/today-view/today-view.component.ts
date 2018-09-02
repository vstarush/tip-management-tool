import { Directive,Component, OnInit, OnDestroy,ElementRef, OnChanges,Input } from 'angular2/core';
import { NgForm } from 'angular2/common';
import { Router } from 'angular2/router';
import { AppService } from '../util/app.service';
import { Invoice } from '../invoice/invoice';


@Component({
  selector: 'today-view',
  templateUrl: 'app/today-view/today-view.component.html',
  styleUrls:  ['app/today-view/today-view.component.css'],
  directives: [],
  providers: [Invoice]
})

export class TodayViewComponent implements OnInit, OnDestroy {
  partsOfTips:number[] = [];
  personsOptions:number[] = [];
  datePicker:JQuery;
  public currentDate:string;
  invoicedeclaredTips:number;
  
  
  constructor(
        public router:Router, 
        public appService:AppService,
        public elementRef:ElementRef,
        public invoice:Invoice
    ) { }
    
  showDatePicker(){
    this.datePicker.show();
  }
    
  ngOnInit(){
    //hide navbar collapse menu
    $(".navbar-toggle").not(".collapsed").click();
    
    //To enable scrolling
    $("body").css("overflow","initial"); 
    
    //Set current date
    this.currentDate = $.datepicker.formatDate( "D mm/dd/yy", new Date() );
    
    //Show navbar
    $("top-navigation").show();
    
    this.datePicker = $(this.elementRef.nativeElement).find('#datepicker');
    this.datePicker.datepicker( {
        onSelect: (date)=> {
            this.setDate(date);
            $(this.datePicker).hide();
        }
    }).hide();
    this.initSelectOptions();
    this.update();
    this.invoice.loadFromServer();
  }
  
  update(){
    this.invoice.update();
  }
  
  partToPercent(part:number){
    return Math.round(part*100);
  }
  
  shareToUSD(share:number){
    return (share*this.invoice.declaredTips).toFixed(2);
  }
  
  shareToUSDRounded(share:number){
    return Math.round(share*this.invoice.declaredTips);
  }

  formatedUSD(amount:number){
    return amount.toFixed(2);
  }
  
  initSelectOptions(){
    for(let i=0;i<25;i++){
      this.partsOfTips[i] = (i+1)/100;
    }
    for(let i=0;i<15;i++){
      this.personsOptions[i] = i;
    }
  }

  withBonusAfterTipOut(){
    if(!this.invoice.bonus || this.invoice.bonus==0 || !this.appService.isAdmin){
      return "";
    }else{
      return "/" + this.invoice.afterTipOutWithBonus; 
    }
  }
  
  setDate(newDate:string){
    this.invoice.date = $.datepicker.formatDate( "D mm/dd/yy", new Date(newDate));
    this.invoice.loadFromServer();
  }
  
  setTotalBarShare(share:number){
    this.invoice.bar.totalShare = share;
    this.update();
  }
  setTotalFoodrunnersShare(share:number){
    this.invoice.foodRunners.totalShare = share;
    this.update();
  }
  setTotalKitchenShare(share:number){
    this.invoice.kitchen.totalShare = share;
    this.update();
  }
  setTotalBarEmployeers(persons:number){
    this.invoice.bar.numberOfWorkers = persons;
    this.update();
  }
  setTotalFoodrunnerEmployeers(persons:number){
    this.invoice.foodRunners.numberOfWorkers = persons;
    this.update();
  }
  setTotalKitchenEmployeers(persons:number){
    this.invoice.kitchen.numberOfWorkers = persons;
    this.update();
  }

  save(){
    this.invoice.save();
  }

  ngOnDestroy(){}
}