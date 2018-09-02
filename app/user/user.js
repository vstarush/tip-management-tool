System.register(['angular2/core', 'angular2/http', 'rxjs/Rx'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var userInstance, User;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            userInstance = null;
            User = (function () {
                function User(http) {
                    this.http = http;
                    this.setDefaults = function () {
                        this.name = "user name",
                            this.role = "default",
                            this.isLogedIn = false;
                    };
                    this.setUser = function (_name, _role, _isLogedIn) {
                        this.name = _name;
                        this.role = _role || "default";
                        this.isLogedIn = _isLogedIn;
                    };
                    this.getUser = function (cb, error) {
                        return this.http.get('/api/v1/currentuser')
                            .map(function (response) { return response.json(); })
                            .subscribe(function (data) { return cb(data); }, function (err) { return error(err); });
                    };
                    if (!userInstance) {
                        userInstance = this;
                        this.setDefaults();
                    }
                    return userInstance;
                }
                User = __decorate([
                    core_1.Component({
                        providers: [http_1.HTTP_PROVIDERS]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], User);
                return User;
            }());
            exports_1("User", User);
        }
    }
});
//# sourceMappingURL=user.js.map