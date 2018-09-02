
System.register(['angular2/core', '../util/app.service', '../user/user', 'angular2/router'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, app_service_1, user_1, router_1;
    var NavigationComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            NavigationComponent = (function () {
                function NavigationComponent(appService, router, zone, user) {
                    this.appService = appService;
                    this.router = router;
                    this.zone = zone;
                    this.user = user;
                }
                NavigationComponent.prototype.ngOnInit = function () {
                    if (!this.user.isLogedIn) {
                        this.router.navigate(['Landing']);
                    }
                };
                NavigationComponent.prototype.fb_logout = function () {
                    var _this = this;
                    this.appService.caller(FB.logout, function (response) {
                        _this.router.navigate(['Landing']);
                    });
                };
                NavigationComponent = __decorate([
                    core_1.Component({
                        selector: 'top-navigation',
                        templateUrl: 'app/navigation/navigation.component.html',
                        styleUrls: ['app/navigation/navigation.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: [user_1.User]
                    }), 
                    __metadata('design:paramtypes', [app_service_1.AppService, router_1.Router, core_1.NgZone, user_1.User])
                ], NavigationComponent);
                return NavigationComponent;
            }());
            exports_1("NavigationComponent", NavigationComponent);
        }
    }
});
//# sourceMappingURL=navigation.component.js.map