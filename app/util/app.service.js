System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var AppService, CurrentDate;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppService = (function () {
                function AppService() {
                    this.isInDeveloping = true;
                    this.isAdmin = true;
                    this.listOfReceivedResonses = [];
                }
                AppService.prototype.waitTheAnswer = function (indexInListOfReceivedResonces, callback) {
                    var _this = this;
                    if (this.listOfReceivedResonses[indexInListOfReceivedResonces] !== "waiting") {
                        callback(this.listOfReceivedResonses[indexInListOfReceivedResonces]);
                        return;
                    }
                    setTimeout(function () {
                        _this.waitTheAnswer(indexInListOfReceivedResonces, callback);
                    }, 30);
                };
                //Fix for angular2 beta for Safari. You need use this function to prevent from
                //loosing components control (prevent screen freezing)
                AppService.prototype.caller = function (procedure, callback) {
                    var _this = this;
                    var newReceivedResponse = "waiting";
                    var currentIndexInListOfReceivedResonces = this.listOfReceivedResonses.length;
                    this.listOfReceivedResonses.push(newReceivedResponse);
                    this.waitTheAnswer(currentIndexInListOfReceivedResonces, callback);
                    procedure(function (response) {
                        _this.listOfReceivedResonses[currentIndexInListOfReceivedResonces] = response;
                    });
                };
                AppService.prototype.ClassDataToJson = function (classInstance) {
                    var jsonObj = {};
                    for (var propName in classInstance) {
                        if (typeof classInstance[propName] !== "function") {
                            if (typeof classInstance[propName] === "object" && classInstance[propName] !== null) {
                                if (Array.isArray(classInstance[propName])) {
                                    var objArray = [];
                                    for (var i = 0; i < classInstance[propName].length; i++) {
                                        objArray.push(this.ClassDataToJson(classInstance[propName][i]));
                                    }
                                    jsonObj[propName] = objArray;
                                }
                                else {
                                    jsonObj[propName] = this.ClassDataToJson(classInstance[propName]);
                                }
                            }
                            else {
                                jsonObj[propName] = classInstance[propName];
                            }
                        }
                    }
                    return jsonObj;
                };
                AppService = __decorate([
                    core_1.Component({
                        providers: []
                    }),
                    __metadata('design:paramtypes', [])
                ], AppService);
                return AppService;
            }());
            exports_1("AppService", AppService);
            exports_1("CurrentDate", CurrentDate = (function () {
                var roundedCurrentDate = new Date();
                // Next working day begins at 6:00 AM
                roundedCurrentDate.setHours(roundedCurrentDate.getHours() - 6);
                // roundedCurrentDate - hours, minutes and seconds are zero
                roundedCurrentDate.setHours(0);
                roundedCurrentDate.setMinutes(0);
                roundedCurrentDate.setSeconds(0);
                roundedCurrentDate.setMilliseconds(0);
                return roundedCurrentDate;
            })());
        }
    }
});
//# sourceMappingURL=app.service.js.map