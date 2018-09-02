import {Component} from 'angular2/core';
import {Http, Headers, HTTP_PROVIDERS,Response} from 'angular2/http';
import 'rxjs/Rx';

interface UserDataInterface {
    name: string;
    role: string;
    updated_at: Date;
    created_at: Date;
    userId: string;
    _id: string;
    __v: number;
}

let userInstance = null;

@Component({
  providers: [HTTP_PROVIDERS]
})

export class User{
    name: string;
    role: string;
    isLogedIn: boolean;
    constructor(public http:Http){
        if(!userInstance){
            userInstance = this;
            this.setDefaults();
        }
        return userInstance;
    }

    setDefaults = function(){
        this.name = "user name",
        this.role = "default",
        this.isLogedIn = false
    };

    setUser = function(_name:string,_role?:string,_isLogedIn?:boolean){
        this.name = _name;
        this.role = _role || "default";
        this.isLogedIn = _isLogedIn;
    };

    getUser = function(cb:(data:UserDataInterface)=>void,error:(err:any)=>void){
        return this.http.get('/api/v1/currentuser')
        .map(response => response.json())
        .subscribe(
          data => cb(data),
          err => error(err)
        );
    };
}


