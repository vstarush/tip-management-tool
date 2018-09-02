import { Component, OnInit,NgZone } from 'angular2/core';
import { AppService } from '../util/app.service';
import { User } from '../user/user';
import { ROUTER_DIRECTIVES,Router } from 'angular2/router';

@Component({
  selector: 'top-navigation',
  templateUrl: 'app/navigation/navigation.component.html',
  styleUrls:  ['app/navigation/navigation.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [User] 
})

export class NavigationComponent implements OnInit {

  constructor(private appService:AppService, private router:Router, private zone:NgZone, public user:User
    ) { }

  ngOnInit() {
      if(!this.user.isLogedIn) {
          this.router.navigate(['Landing']);
      }
  }

  fb_logout() {
      this.appService.caller(FB.logout,(response) => {
          this.router.navigate(['Landing']);
      });
  }
}

