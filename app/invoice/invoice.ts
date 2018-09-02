
import { Directive,Component,Input} from 'angular2/core';
import {Http, Headers, HTTP_PROVIDERS,Response} from 'angular2/http';
import { AppService,CurrentDate } from '../util/app.service';
import 'rxjs/Rx';
import { User } from '../user/user';


@Component({
  providers: []
})

export class Invoice {
  constructor(private http:Http, private user:User){
    // make http enumerable:false to remove http from list of properties in foreEach loop
    // we need this to convert class data to Json 
    Object.defineProperty(this, 'http', {
       enumerable:false,
       writable:false,
       configurable:false
    });
     Object.defineProperty(this, 'user', {
       enumerable:false,
       writable:false,
       configurable:false
    });
  }

  date: string = $.datepicker.formatDate( "D mm/dd/yy", CurrentDate);
  dateTime:number = new Date(this.date).getTime();
  netDeposit: number = null;
  declaredTips: number = null;
  laborHours: number = null;
  bonus: number = null;
  payout: number = 0;
  totalTipOut:number = 0;
  afterTipOut: number = 0;
  afterTipOutWithBonus:number = 0;
  
  //Create taproom bar department with defaults 
    bar = new Department(6,0.15,5,"BAR",[]);
    foodRunners = new Department(3,0.1,8,"RUNNER",[]);
    kitchen = new Department(1,0.05,1,"KITCHEN",[]);
  
  update(){
    this.bar.update();
    this.foodRunners.update();
    this.kitchen.update();
    // this.totalTipOutCalc();// use this function if precise tips needed
    this.totalTipOutCalcRounded(); // use this function if you pay tips without cents (rounded to whole dollar)
    this.payoutCalc();
  }
  
  private payoutCalc(){
    this.afterTipOut = this.declaredTips - this.totalTipOut;
    this.afterTipOutWithBonus = this.afterTipOut + this.bonus;
  }
  
  // use this function if precise tips needed
  private totalTipOutCalc(){
    return this.totalTipOut = this.declaredTips*( this.bar.totalShare + this.foodRunners.totalShare + this.kitchen.totalShare );  
  }
  
  // use this function if you pay tips without cents (rounded to whole dollar)
  private totalTipOutCalcRounded(){
    let totalTipOut = 0;
    for(let i=0;i<this.bar.employeesList.length;i++){
       totalTipOut += Math.round(this.bar.employeesList[i].tipsShare*this.declaredTips);
    }
    for(let i=0;i<this.foodRunners.employeesList.length;i++){
       totalTipOut += Math.round(this.foodRunners.employeesList[i].tipsShare*this.declaredTips);
    }
    for(let i=0;i<this.kitchen.employeesList.length;i++){
       totalTipOut += Math.round(this.kitchen.employeesList[i].tipsShare*this.declaredTips);
    }
    return this.totalTipOut = totalTipOut;
  }
  
  save(){
      this.dateTime = new Date(this.date).getTime();
      let invoce = AppService.prototype.ClassDataToJson(this);
      let stringData = JSON.stringify(invoce);
      
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('/api/v1/invoice',stringData, {
            headers: headers
      })
      .subscribe(
        data => {console.log(data);},
        err => console.log(err),
        () => alert("Your daily invoice was successfully saved")
      );
  }
  
  loadFromServer(){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let urlDate = encodeURI($.datepicker.formatDate( "mm-dd-yy", new Date(this.date) ));
      this.http.get('/api/v1/invoice/'+urlDate, {
            headers: headers
      })
      .map(response => response.json())
      .subscribe(
        data => {
          this.loadInvoiceFromJson(data);
        },
        err => console.log(err.json().message),
        () => {}
      );
  }
  
  private loadInvoiceFromJson(jsonObj:Object){
      if(!jsonObj){
        //If there is no record for this date, then we will load default invoice
        var defaultInvoice:Invoice = new Invoice(this.http,this.user);
        defaultInvoice.update();
        defaultInvoice.date = this.date;
        this.loadInvoiceFromJson(defaultInvoice);
        return;
      } 
      // Load simple type data to this (invoice)
      for (var propName in this) {
            if(typeof this[propName] !== "function" && typeof this[propName] !== "object" || this[propName] === null){
              this[propName] = jsonObj[propName];
            }
      }
      var loadDepartmentData = (department:string) => {
          this[department].totalShare = Number(jsonObj[department]["totalShare"]);
          this[department].numberOfWorkers = Number(jsonObj[department]["numberOfWorkers"]);
          this[department].update();

          for(let i=0;i<this[department].numberOfWorkers;i++){
            this[department].employeesList[i] = jsonObj[department]["employeesList"][i];
          }
      }
      loadDepartmentData("bar");
      loadDepartmentData("kitchen");
      loadDepartmentData("foodRunners");
  }
  
}

class Department{
  
  constructor(
      public numberOfWorkers:number,
      //what part of tipsDecalred will go to this department
      public totalShare:number, 
      // defaultHours - how much usually employees from this department work a day
      private defaultHours:number,
      private nameOfDepartment:string,
      public employeesList:Employee[] 
  ){}
  
  update(){
    // newEmployeesList is updated array of individual employees labor hours and their part of netDeposit
    let newEmployeesList:Employee[] = [];
    // Summ of all employees labor Hours
    let totalHours = 0;
    for(let i=0;i<this.numberOfWorkers;i++){
      newEmployeesList[i] = this.employeesList[i] || new Employee(this.defaultHours,this.nameOfDepartment +" "+ (i+1));
      totalHours += newEmployeesList[i].hours; 
    }
    //tipsShare calculation for each employee
    for(let i=0;i<this.numberOfWorkers;i++){
      newEmployeesList[i].tipsShare = (this.totalShare * newEmployeesList[i].hours)/totalHours;
    }
     this.employeesList = newEmployeesList;
  }
}

class Employee {
  constructor(
    //Labor hours
    public hours:number,
    public name?:string,
    //Part of tipsDecalred
    public tipsShare?:number
  ){
    this.tipsShare = this.tipsShare || 0;
  };
}
