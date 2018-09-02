import {Component} from 'angular2/core';


@Component({
  providers: []
})

export class AppService {
    
    constructor(){}
    
    public isInDeveloping:boolean = true;
    public isAdmin:boolean = true;
    private listOfReceivedResonses:any[] = [];
    
    waitTheAnswer(indexInListOfReceivedResonces:number,callback:(resond:any)=>any){
        if(this.listOfReceivedResonses[indexInListOfReceivedResonces] !== "waiting"){
            callback(this.listOfReceivedResonses[indexInListOfReceivedResonces]);
            return;
        }
        setTimeout(()=> {
             this.waitTheAnswer(indexInListOfReceivedResonces,callback);
        }, 30);
    }

    //Fix for angular2 beta for Safari. You need use this function to prevent from
    //loosing components control (prevent screen freezing)

    public caller(procedure:(resond:any)=>any,callback:(resond:any)=>any){
        let newReceivedResponse = "waiting";
        let currentIndexInListOfReceivedResonces = this.listOfReceivedResonses.length;
        this.listOfReceivedResonses.push(newReceivedResponse);
        this.waitTheAnswer(currentIndexInListOfReceivedResonces,callback);
        procedure((response)=>{
            this.listOfReceivedResonses[currentIndexInListOfReceivedResonces] = response;
        });
    }

    ClassDataToJson(classInstance:any) {
        let jsonObj = {};
        for (var propName in classInstance) {
            if(typeof classInstance[propName] !== "function"){
                if(typeof classInstance[propName] === "object" && classInstance[propName] !== null){
                if(Array.isArray(classInstance[propName])){
                    let objArray = [];
                    for (let i=0;i<classInstance[propName].length;i++){
                    objArray.push(this.ClassDataToJson(classInstance[propName][i]));
                    }
                    jsonObj[propName] = objArray;
                }else{
                    jsonObj[propName] = this.ClassDataToJson(classInstance[propName]);
                }
                }else{
                jsonObj[propName] = classInstance[propName];
                }
            }
        }
        return jsonObj;
   }
}

export var CurrentDate:Date = (():Date => {
    var roundedCurrentDate:Date = new Date();
    // Next working day begins at 6:00 AM
    roundedCurrentDate.setHours(roundedCurrentDate.getHours()-6);
    // roundedCurrentDate - hours, minutes and seconds are zero
    roundedCurrentDate.setHours(0);
    roundedCurrentDate.setMinutes(0);
    roundedCurrentDate.setSeconds(0);
    roundedCurrentDate.setMilliseconds(0);
    return roundedCurrentDate;
})();
