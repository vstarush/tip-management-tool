System.register(['angular2/core', 'angular2/router', '../util/app.service', '../paycheck/paycheck', '../paycheck-list/paycheck-list', 'angular2/http'], function(exports_1, context_1) {
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
    var core_1, router_1, app_service_1, paycheck_1, paycheck_list_1, http_1;
    var DashboardViewComponent;
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
            function (paycheck_1_1) {
                paycheck_1 = paycheck_1_1;
            },
            function (paycheck_list_1_1) {
                paycheck_list_1 = paycheck_list_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            DashboardViewComponent = (function () {
                function DashboardViewComponent(router, appService, elementRef, http, paycheck, paycheckList) {
                    this.router = router;
                    this.appService = appService;
                    this.elementRef = elementRef;
                    this.http = http;
                    this.paycheck = paycheck;
                    this.paycheckList = paycheckList;
                    this.paychecks = [];
                }
                DashboardViewComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    //hide navbar collapse menu
                    $(".navbar-toggle").not(".collapsed").click();
                    this.currentDate = $.datepicker.formatDate("D mm/dd/yy", new Date());
                    // Load paychecks from db
                    this.paycheckList.loadPaycheckList()
                        .then(function (paychecks) { return _this.paychecks = paychecks; })
                        .catch(function (error) { console.log(error); });
                };
                DashboardViewComponent.prototype.showDatePickerStartDate = function (i) {
                    var _this = this;
                    this.closeAllDatePickers();
                    var datePickerStart = $(this.elementRef.nativeElement).find('.datepickerStartDate:eq(' + i + ')');
                    datePickerStart.datepicker({
                        onSelect: function (date) {
                            _this.setStartDate(date, i);
                            datePickerStart.datepicker('destroy');
                        }
                    });
                };
                DashboardViewComponent.prototype.showDatePickerEndDate = function (i) {
                    var _this = this;
                    this.closeAllDatePickers();
                    var minDate = this.paychecks[i].startDate;
                    var datePickerEnd = $(this.elementRef.nativeElement).find('.datepickerEndDate:eq(' + i + ')');
                    datePickerEnd
                        .datepicker('setDate', this.paychecks[i].endDate)
                        .datepicker({
                        minDate: minDate,
                        onSelect: function (date) {
                            _this.setEndDate(date, i);
                            datePickerEnd.datepicker('destroy');
                        }
                    });
                };
                DashboardViewComponent.prototype.setStartDate = function (newDate, i) {
                    this.paychecks[i].startDate = new Date(newDate);
                    this.paychecks[i].endDate = this.plusTwoWeeks(newDate);
                    this.paychecks[i].update();
                    this.paycheckList.save(this.paychecks);
                };
                DashboardViewComponent.prototype.setEndDate = function (newDate, i) {
                    this.paychecks[i].endDate = new Date(newDate);
                    this.paychecks[i].update();
                    this.paycheckList.save(this.paychecks);
                };
                DashboardViewComponent.prototype.plusTwoWeeks = function (date) {
                    var dateAfterTwoWeeks = new Date(date);
                    dateAfterTwoWeeks.setDate(new Date(date).getDate() + 13);
                    return dateAfterTwoWeeks;
                };
                DashboardViewComponent.prototype.createPaycheck = function () {
                    this.closeAllDatePickers();
                    var newPaycheck = this.paycheck.newPaycheck();
                    newPaycheck.overTime = Math.random() * 100;
                    this.paychecks.unshift(newPaycheck);
                    this.paycheckList.save(this.paychecks);
                };
                DashboardViewComponent.prototype.deletePaycheck = function (i) {
                    this.paychecks.splice(i, 1);
                    this.paycheckList.save(this.paychecks);
                };
                DashboardViewComponent.prototype.closeAllDatePickers = function () {
                    $(this.elementRef.nativeElement).find('.datepickerEndDate').datepicker().datepicker('destroy');
                    $(this.elementRef.nativeElement).find('.datepickerStartDate').datepicker().datepicker('destroy');
                };
                DashboardViewComponent.prototype.bonusAfterTipOut = function (paycheck) {
                    if (!this.paycheck.totalBonus || this.paycheck.totalBonus == 0 || !this.appService.isAdmin) {
                        return "";
                    }
                    else {
                        return "/" + (this.paycheck.totalBonus + this.paycheck.tipsTakenHome);
                    }
                };
                DashboardViewComponent.prototype.ngOnDestroy = function () {
                };
                DashboardViewComponent = __decorate([
                    core_1.Component({
                        selector: 'dashboard-view',
                        templateUrl: 'app/dashboard-view/dashboard-view.component.html',
                        styleUrls: ['app/dashboard-view/dashboard-view.component.css'],
                        providers: [paycheck_1.Paycheck, paycheck_list_1.PaycheckList]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, app_service_1.AppService, core_1.ElementRef, http_1.Http, paycheck_1.Paycheck, paycheck_list_1.PaycheckList])
                ], DashboardViewComponent);
                return DashboardViewComponent;
            }());
            exports_1("DashboardViewComponent", DashboardViewComponent);
        }
    }
});
//# sourceMappingURL=dashboard-view.component.js.map