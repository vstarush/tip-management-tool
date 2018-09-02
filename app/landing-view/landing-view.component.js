
System.register(['angular2/core', 'angular2/router', '../util/app.service', '../user/user'], function(exports_1, context_1) {
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

    var core_1, router_1, app_service_1, user_1;
    var LandingViewComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            LandingViewComponent = (function () {
                function LandingViewComponent(router, appService, user) {
                    var _this = this;
                    this.router = router;
                    this.appService = appService;
                    this.user = user;
                    this.loginButtonText = function () {
                        if (_this.user.isLogedIn) {
                            return "Continue";
                        }
                        else {
                            return "Login with Facebook";
                        }
                    };
                }
                LandingViewComponent.prototype.ngOnInit = function () {
                    //Hide navbar on landing page
                    $("top-navigation").hide();
                    //To prevent scrolling
                    $("body").css("overflow", "hidden");
                };
                LandingViewComponent.prototype.ngOnDestroy = function () {
                };
                LandingViewComponent.prototype.fb_login = function () {
                };
                LandingViewComponent.prototype.fb_getUserName = function () {
                };
                LandingViewComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/landing-view/landing-view.component.html',
                        styleUrls: ['app/landing-view/landing-view.component.css'],
                        providers: [user_1.User]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, app_service_1.AppService, user_1.User])
                ], LandingViewComponent);
                return LandingViewComponent;
            }());
            exports_1("LandingViewComponent", LandingViewComponent);
        }
    }
});
//# sourceMappingURL=landing-view.component.js.map