// Every Angular app has at least one root component, conventionally named AppComponent, that hosts the client user experience.
// Components are the basic building blocks of Angular applications. A component controls a portion of the screen — a view — through its associated template.

import {Component,OnInit,OnChanges,NgZone,Input,ViewChild} from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS,RouteDefinition,Router } from 'angular2/router';


import { LandingViewComponent } from './landing-view/landing-view.component';
import { TodayViewComponent } from './today-view/today-view.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { NavigationComponent } from './navigation/navigation.component';

import { AppService } from './util/app.service';
import { User } from './user/user';


@Component({
    //The element for this component is named my-app. Angular creates and displays an instance of our AppComponent
    // wherever it encounters a my-app element in the host HTML
    selector: 'my-app',
    //A more advanced template could contain data bindings to component properties and might identify other application components
    // which have their own templates. These templates might identify yet other components. In this way an Angular application becomes a tree of components.
    // top-navigation style="display:none;" to hide immidiatly on landing page
    template: `
      <top-navigation  style="display:none;"></top-navigation>
      <router-outlet></router-outlet>
    `,
    //router will control all directives so we need to add only the router derivative here
    directives: [ROUTER_DIRECTIVES,
        NavigationComponent],
    //Services that we will use. We need to add it only one time in the app.component.ts
    providers: [
        ROUTER_PROVIDERS,AppService,User
    ]
})


// The @RouteConfig decorator simultaneously (a) assign a router to the component and (b) configure that router with routes.
// Routes tell the router which views to display when a user clicks a link or pastes a URL into the browser address bar.
@RouteConfig([
  {
    path: '/',
    name: 'Landing',
    component: LandingViewComponent,
    useAsDefault: true
  },
  {
    path: '/today',
    name: 'Today',
    component: TodayViewComponent
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardViewComponent
  }
])

//We can expand this class with properties and application logic
//We export AppComponent so that we can import it elsewhere in our application
export class AppComponent implements OnInit{
  constructor(public appServise:AppService,private zone:NgZone,public router:Router, public user:User) {
       // Subscribe for routes changes
        router.subscribe((urlString:string) => {
          // Watch for url parameters statrs from '?userName' - that will appear after successful authorisation
          // with passportjs
            if(urlString.startsWith('?userName')){
              // Get loggedin user
              this.user.getUser(
                //callback function, will be called if user session was started
                (data)=>{
                  // Set this session user
                  this.user.setUser(data.name,data.role,true);
                  // Navigate to the Today view
                  this.router.navigate(['Today']);
                },
                (err)=>{
                   alert("User session is broken. Try to login again.")
                }
              );
            } 
        });
  } 
  @ViewChild(TodayViewComponent) child:TodayViewComponent;
  ngOnInit() {}
}


  