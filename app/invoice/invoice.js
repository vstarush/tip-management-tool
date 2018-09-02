System.register(['angular2/core', 'angular2/http', '../util/app.service', 'rxjs/Rx', '../user/user'], function(exports_1, context_1) {
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
    var core_1, http_1, app_service_1, user_1;
    var Invoice, Department, Employee;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            },
            function (_1) {},
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            // import moment from 'moment';
            Invoice = (function () {
                function Invoice(http, user) {
                    this.http = http;
                    this.user = user;
                    this.date = $.datepicker.formatDate("D mm/dd/yy", app_service_1.CurrentDate);
                    this.dateTime = new Date(this.date).getTime();
                    this.netDeposit = null;
                    this.declaredTips = null;
                    this.laborHours = null;
                    this.bonus = null;
                    this.payout = 0;
                    this.totalTipOut = 0;
                    this.afterTipOut = 0;
                    this.afterTipOutWithBonus = 0;
                    //Create taproom bar department with defaults 
                    this.bar = new Department(6, 0.15, 5, "BAR", []);
                    this.foodRunners = new Department(3, 0.1, 8, "RUNNER", []);
                    this.kitchen = new Department(1, 0.05, 1, "KITCHEN", []);
                    // make http enumerable:false to remove http from list of properties in foreEach loop
                    // we need this to convert class data to Json 
                    Object.defineProperty(this, 'http', {
                        enumerable: false,
                        writable: false,
                        configurable: false
                    });
                    Object.defineProperty(this, 'user', {
                        enumerable: false,
                        writable: false,
                        configurable: false
                    });
                }
                Invoice.prototype.update = function () {
                    this.bar.update();
                    this.foodRunners.update();
                    this.kitchen.update();
                    // this.totalTipOutCalc();// use this function if precise tips needed
                    this.totalTipOutCalcRounded(); // use this function if you pay tips without cents (rounded to whole dollar)
                    this.payoutCalc();
                };
                Invoice.prototype.payoutCalc = function () {
                    this.afterTipOut = this.declaredTips - this.totalTipOut;
                    this.afterTipOutWithBonus = this.afterTipOut + this.bonus;
                };
                // use this function if precise tips needed
                Invoice.prototype.totalTipOutCalc = function () {
                    return this.totalTipOut = this.declaredTips * (this.bar.totalShare + this.foodRunners.totalShare + this.kitchen.totalShare);
                };
                // use this function if you pay tips without cents (rounded to whole dollar)
                Invoice.prototype.totalTipOutCalcRounded = function () {
                    var totalTipOut = 0;
                    for (var i = 0; i < this.bar.employeesList.length; i++) {
                        totalTipOut += Math.round(this.bar.employeesList[i].tipsShare * this.declaredTips);
                    }
                    for (var i = 0; i < this.foodRunners.employeesList.length; i++) {
                        totalTipOut += Math.round(this.foodRunners.employeesList[i].tipsShare * this.declaredTips);
                    }
                    for (var i = 0; i < this.kitchen.employeesList.length; i++) {
                        totalTipOut += Math.round(this.kitchen.employeesList[i].tipsShare * this.declaredTips);
                    }
                    return this.totalTipOut = totalTipOut;
                };
                Invoice.prototype.save = function () {
                    this.dateTime = new Date(this.date).getTime();
                    var invoce = app_service_1.AppService.prototype.ClassDataToJson(this);
                    var stringData = JSON.stringify(invoce);
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('/api/v1/invoice', stringData, {
                        headers: headers
                    })
                        .subscribe(function (data) { console.log(data); }, function (err) { return console.log(err); }, function () { return alert("Your daily invoice was successfully saved"); });
                };
                Invoice.prototype.loadFromServer = function () {
                    var _this = this;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    var urlDate = encodeURI($.datepicker.formatDate("mm-dd-yy", new Date(this.date)));
                    this.http.get('/api/v1/invoice/' + urlDate, {
                        headers: headers
                    })
                        .map(function (response) { return response.json(); })
                        .subscribe(function (data) {
                        _this.loadInvoiceFromJson(data);
                    }, function (err) { return console.log(err.json().message); }, function () { });
                };
                Invoice.prototype.loadInvoiceFromJson = function (jsonObj) {
                    var _this = this;
                    if (!jsonObj) {
                        //If there is no record for this date, then we will load default invoice
                        var defaultInvoice = new Invoice(this.http, this.user);
                        defaultInvoice.update();
                        defaultInvoice.date = this.date;
                        this.loadInvoiceFromJson(defaultInvoice);
                        return;
                    }
                    // Load simple type data to this (invoice)
                    for (var propName in this) {
                        if (typeof this[propName] !== "function" && typeof this[propName] !== "object" || this[propName] === null) {
                            this[propName] = jsonObj[propName];
                        }
                    }
                    var loadDepartmentData = function (department) {
                        _this[department].totalShare = Number(jsonObj[department]["totalShare"]);
                        _this[department].numberOfWorkers = Number(jsonObj[department]["numberOfWorkers"]);
                        _this[department].update();
                        for (var i = 0; i < _this[department].numberOfWorkers; i++) {
                            _this[department].employeesList[i] = jsonObj[department]["employeesList"][i];
                        }
                    };
                    loadDepartmentData("bar");
                    loadDepartmentData("kitchen");
                    loadDepartmentData("foodRunners");
                };
                Invoice = __decorate([
                    core_1.Component({
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, user_1.User])
                ], Invoice);
                return Invoice;
            }());
            exports_1("Invoice", Invoice);
            Department = (function () {
                function Department(numberOfWorkers, 
                    //what part of tipsDecalred will go to this department
                    totalShare, 
                    // defaultHours - how much usually employees from this department work a day
                    defaultHours, nameOfDepartment, employeesList) {
                    this.numberOfWorkers = numberOfWorkers;
                    this.totalShare = totalShare;
                    this.defaultHours = defaultHours;
                    this.nameOfDepartment = nameOfDepartment;
                    this.employeesList = employeesList;
                }
                Department.prototype.update = function () {
                    // newEmployeesList is updated array of individual employees labor hours and their part of netDeposit
                    var newEmployeesList = [];
                    // Summ of all employees labor Hours
                    var totalHours = 0;
                    for (var i = 0; i < this.numberOfWorkers; i++) {
                        newEmployeesList[i] = this.employeesList[i] || new Employee(this.defaultHours, this.nameOfDepartment + " " + (i + 1));
                        totalHours += newEmployeesList[i].hours;
                    }
                    //tipsShare calculation for each employee
                    for (var i = 0; i < this.numberOfWorkers; i++) {
                        newEmployeesList[i].tipsShare = (this.totalShare * newEmployeesList[i].hours) / totalHours;
                    }
                    this.employeesList = newEmployeesList;
                };
                return Department;
            }());
            Employee = (function () {
                function Employee(
                    //Labor hours
                    hours, name, 
                    //Part of tipsDecalred
                    tipsShare) {
                    this.hours = hours;
                    this.name = name;
                    this.tipsShare = tipsShare;
                    this.tipsShare = this.tipsShare || 0;
                }
                ;
                return Employee;
            }());
        }
    }
});
//# sourceMappingURL=invoice.js.map