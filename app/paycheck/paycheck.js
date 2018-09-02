System.register(['angular2/core', 'angular2/http', '../util/app.service', 'rxjs/Rx', '../invoice/invoice'], function(exports_1, context_1) {
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
    var core_1, http_1, app_service_1, invoice_1;
    var standartWorkingDay, standartRate, overtimeRate, Paycheck;
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
            function (invoice_1_1) {
                invoice_1 = invoice_1_1;
            }],
        execute: function() {
            //Default constants
            //Hours after standartWorkingDay will count like overtime
            standartWorkingDay = 8;
            standartRate = 12.25;
            overtimeRate = 18.38;
            Paycheck = (function () {
                function Paycheck(http) {
                    this.http = http;
                    this.startDate = app_service_1.CurrentDate;
                    this.endDate = this.datePlusTwoWeeks();
                    this.setDefaults();
                    this.update();
                }
                Paycheck.prototype.newPaycheck = function () {
                    return new Paycheck(this.http);
                };
                Paycheck.prototype.newPaycheckWithDateRange = function (dateRange) {
                    var newPaycheck = new Paycheck(this.http);
                    newPaycheck.setDateRange(dateRange);
                    return newPaycheck;
                };
                Paycheck.prototype.setDefaults = function () {
                    this.hrly = 0;
                    this.hrlyHours = 0;
                    this.overTime = 0;
                    this.overTimeHours = 0;
                    this.declaredTips = 0;
                    this.paidOutTips = 0;
                    this.tipsTakenHome = 0;
                    this.totalBonus = 0;
                };
                Paycheck.prototype.setDateRange = function (dateRange) {
                    this.startDate = dateRange.startDate;
                    this.endDate = dateRange.endDate;
                    this.update();
                };
                Paycheck.prototype.formatedStartDate = function () {
                    return this.formatedDate(this.startDate);
                };
                Paycheck.prototype.formatedEndDate = function () {
                    return this.formatedDate(this.endDate);
                };
                //Date format to show on screen fields
                Paycheck.prototype.formatedDate = function (date) {
                    return $.datepicker.formatDate("D mm/dd/yy", new Date(date.toDateString()));
                };
                Paycheck.prototype.datePlusTwoWeeks = function () {
                    //Make copy of CurrentDate
                    var dateAfterTwoWeeks = new Date(app_service_1.CurrentDate.toDateString());
                    dateAfterTwoWeeks.setDate(new Date().getDate() + 13);
                    return dateAfterTwoWeeks;
                };
                Paycheck.prototype.update = function () {
                    this.loadInvoices();
                };
                Paycheck.prototype.loadInvoices = function () {
                    var _this = this;
                    var rangeStartDate = this.startDate;
                    var rangeEndDate = this.endDate;
                    //if wrong date range return defaults
                    if (rangeStartDate > rangeEndDate) {
                        this.setDefaults();
                        return;
                    }
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    var urlStartDate = encodeURI($.datepicker.formatDate("mm-dd-yy", rangeStartDate));
                    var urlEndDate = encodeURI($.datepicker.formatDate("mm-dd-yy", rangeEndDate));
                    this.http.get('/api/v1/invoice-range/' + urlStartDate + ":" + urlEndDate, {
                        headers: headers
                    })
                        .map(function (response) { return response.json(); })
                        .subscribe(function (data) {
                        _this.loadInvoicesFromJson(data);
                    }, function (err) { return console.log(err.json().message); }, function () { });
                };
                Paycheck.prototype.calculate = function () {
                    this.setDefaults();
                    for (var i = 0; i < this.invoices.length; i++) {
                        this.declaredTips += this.invoices[i].declaredTips;
                        this.tipsTakenHome += this.invoices[i].afterTipOut;
                        this.totalBonus += this.invoices[i].bonus;
                    }
                };
                Paycheck.prototype.loadInvoicesFromJson = function (data) {
                    this.invoices = data;
                    this.calculate();
                };
                Paycheck = __decorate([
                    core_1.Component({
                        providers: [invoice_1.Invoice, http_1.Http]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], Paycheck);
                return Paycheck;
            }());
            exports_1("Paycheck", Paycheck);
        }
    }
});
//# sourceMappingURL=paycheck.js.map