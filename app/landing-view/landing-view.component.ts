import { Component, OnInit, OnDestroy,OnChanges } from 'angular2/core';
import { Router } from 'angular2/router';
import {AppService} from '../util/app.service';
import {User} from '../user/user';
import { Observable }     from 'rxjs/Observable';
import {Http, Headers, HTTP_PROVIDERS,Response} from 'angular2/http';


@Component({
  templateUrl: 'app/landing-view/landing-view.component.html',
  styleUrls:  ['app/landing-view/landing-view.component.css'],
  providers: [User]
})
export class LandingViewComponent implements OnInit, OnDestroy {
  constructor(
        public router:Router, public appService:AppService, public user:User
    ) { 
        
    }
    
  ngOnInit(){
      //Hide navbar on landing page
      $("top-navigation").hide();
      //To prevent scrolling
      $("body").css("overflow","hidden");  
  }
  
  loginButtonText = ():string => {
      if(this.user.isLogedIn){
          return "Continue";
      }else{
          return "Login with Facebook";
      }
  }
  
  ngOnDestroy(){}

  fb_login() {
      if(this.appService.isInDeveloping){
       this.router.navigate(['Today']);
       return;
      }
      
      //Check if user can enter without new facebook login
      if(this.appService.isLoggedIn){
          this.router.navigate(['Today']);
          this.fb_getUserName();
      }else{
            this.appService.caller((callback)=>{
                FB.login(callback,{
                    scope: 'public_profile'
                });
            },(response)=>{
                if (response.authResponse) {
                    var access_token = response.authResponse.accessToken; //get access token
                    var user_id = response.authResponse.userID; //get FB UID
                    this.appService.isLoggedIn = true;	
                    this.fb_getUserName();
                    this.router.navigate(['Today']);
                } else {
                    //user hit cancel button
                }
            });
      }
	}

  fb_getUserName() {
      this.appService.caller((callback)=>{
          FB.api('/me',callback);
      },(response)=>{
          this.appService.userName = response.name;
      });
  }
    
}