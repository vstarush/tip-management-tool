import { Directive, Component, Input } from 'angular2/core';
import { Http, Headers, HTTP_PROVIDERS, Response } from 'angular2/http';
import { AppService } from '../util/app.service';
import 'rxjs/Rx';
import { Invoice } from '../invoice/invoice';
import { Paycheck } from '../paycheck/paycheck';

@Component({
  providers: [Invoice,Http]
})

export class PaycheckList {

    constructor(private http:Http, private paycheck:Paycheck){ }
    
    //Load paychecks from db   
    loadPaycheckList():Promise<Paycheck[]>{
        return new Promise((resolve, reject) => {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            this.http.get('/api/v1/paychecks', {
                    headers: headers
            })
            .map(response => response.json())
            .subscribe(
                data => {
                    let paychecks = this.jsonToArrayOfPaychecks(data);
                    resolve(paychecks);
                },
                err => {
                    reject(err.json().message)
                },
                () => {}
            );
        });       
    }

    //Save paychecks to db
    save(paychecks:Paycheck[]):void{
      let paycheckDateRanges:DateRanges = this.arrayOfPaychecksToDateRanges(paychecks);
      let paychecksJSON = {dateRanges:paycheckDateRanges};
      let stringData = JSON.stringify(paychecksJSON);     
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post('/api/v1/paychecks',stringData, {
            headers: headers
      })
      .subscribe(
        data => {
            // console.log(data);
        },
        err => console.log(err),
        () => {
            //console.log("paycheckList loaded")
        }
      );
    }
    
    //Convert pairs [{startDate;endDate}] to array of Paycheck
    jsonToArrayOfPaychecks(_data:any):Paycheck[]{
        _data = _data || {dateRanges:[]};
        var arrayOfPaychecks:Paycheck[] = [];
        let dateRanges = _data["dateRanges"];
        for(let i=0;i<dateRanges.length;i++){
            //dataRange is look like {startDate;endDate}
            let dataRange = dateRanges[i];
            dataRange.startDate = new Date(dataRange.startDate);
            dataRange.endDate = new Date(dataRange.endDate);
            arrayOfPaychecks[i] = this.paycheck.newPaycheckWithDateRange(dataRange);
        }
        return arrayOfPaychecks;
    }

    //Convert paychecks to it's date ranges ( [{startDate;endDate}] )
    arrayOfPaychecksToDateRanges(_arrayOfPaychecks:Paycheck[]):DateRanges{
        var _paycheckDateRanges:DateRanges = [];
        for(let i=0;i<_arrayOfPaychecks.length;i++){
            let _startDate = _arrayOfPaychecks[i].startDate;
            let _endDate = _arrayOfPaychecks[i].endDate;
            _paycheckDateRanges[i] = {
                startDate:_startDate,
                endDate:_endDate
            };
        }
        return _paycheckDateRanges;
    }
    
}

interface DateRanges {
    [index: number]: {
        startDate:Date,
        endDate:Date
    }
}
