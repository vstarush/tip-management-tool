// Every Angular app has at least one root component, conventionally named AppComponent, that hosts the client user experience.
// Components are the basic building blocks of Angular applications. A component controls a portion of the screen — a view — through its associated template.

System.register(['angular2/core', 'angular2/router', './landing-view/landing-view.component', './today-view/today-view.component', './dashboard-view/dashboard-view.component', './navigation/navigation.component', './util/app.service', './user/user'], function(exports_1, context_1) {
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
    var core_1, router_1, landing_view_component_1, today_view_component_1, dashboard_view_component_1, navigation_component_1, app_service_1, user_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (landing_view_component_1_1) {
                landing_view_component_1 = landing_view_component_1_1;
            },
            function (today_view_component_1_1) {
                today_view_component_1 = today_view_component_1_1;
            },
            function (dashboard_view_component_1_1) {
                dashboard_view_component_1 = dashboard_view_component_1_1;
            },
            function (navigation_component_1_1) {
                navigation_component_1 = navigation_component_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(appServise, zone, router, user) {
                    var _this = this;
                    this.appServise = appServise;
                    this.zone = zone;
                    this.router = router;
                    this.user = user;
                    // Subscribe for routes changes
                    router.subscribe(function (urlString) {
                        // Watch for url parameters statrs from '?userName' - that will appear after successful authorisation
                        // with passportjs
                        if (urlString.startsWith('?userName')) {
                            // Get loggedin user
                            _this.user.getUser(
                            //callback function, will be called if user session was started
                            function (data) {
                                // Set this session user
                                _this.user.setUser(data.name, data.role, true);
                                // Navigate to the Today view
                                _this.router.navigate(['Today']);
                            }, function (err) {
                                alert("User session is broken. Try to login again.");
                            });
                        }
                    });
                }
                AppComponent.prototype.ngOnInit = function () {};
                __decorate([
                    core_1.ViewChild(today_view_component_1.TodayViewComponent), 
                    __metadata('design:type', today_view_component_1.TodayViewComponent)
                ], AppComponent.prototype, "child", void 0);
                
                AppComponent = __decorate([
                    core_1.Component({
                        //The element for this component is named my-app. Angular creates and displays an instance of our AppComponent
                        // wherever it encounters a my-app element in the host HTML
                        selector: 'my-app',
                        //A more advanced template could contain data bindings to component properties and might identify other application components
                        // which have their own templates. These templates might identify yet other components. In this way an Angular application becomes a tree of components.
                        // top-navigation style="display:none;" to hide immidiatly on landing page
                        template: "\n      <top-navigation  style=\"display:none;\"></top-navigation>\n      <router-outlet></router-outlet>\n    ",
                        //router will control all directives so we need to add only the router derivative here
                        directives: [router_1.ROUTER_DIRECTIVES,
                            navigation_component_1.NavigationComponent],
                        //Services that we will use. We need to add it only one time in the app.component.ts
                        providers: [
                            router_1.ROUTER_PROVIDERS, app_service_1.AppService, user_1.User
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/',
                            name: 'Landing',
                            component: landing_view_component_1.LandingViewComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/today',
                            name: 'Today',
                            component: today_view_component_1.TodayViewComponent
                        },
                        {
                            path: '/dashboard',
                            name: 'Dashboard',
                            component: dashboard_view_component_1.DashboardViewComponent
                        }
                    ]),
                    __metadata('design:paramtypes', [app_service_1.AppService, core_1.NgZone, router_1.Router, user_1.User])
                ], AppComponent);

                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);