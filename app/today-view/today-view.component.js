System.register(['angular2/core', 'angular2/router', '../util/app.service', '../invoice/invoice'], function(exports_1, context_1) {
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
    var core_1, router_1, app_service_1, invoice_1;
    var TodayViewComponent;
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
            function (invoice_1_1) {
                invoice_1 = invoice_1_1;
            }],
        execute: function() {
            TodayViewComponent = (function () {
                function TodayViewComponent(router, appService, elementRef, invoice) {
                    this.router = router;
                    this.appService = appService;
                    this.elementRef = elementRef;
                    this.invoice = invoice;
                    this.partsOfTips = [];
                    this.personsOptions = [];
                }
                TodayViewComponent.prototype.showDatePicker = function () {
                    this.datePicker.show();
                };
                TodayViewComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    //hide navbar collapse menu
                    $(".navbar-toggle").not(".collapsed").click();
                    //To enable scrolling
                    $("body").css("overflow", "initial");
                    //Set current date
                    this.currentDate = $.datepicker.formatDate("D mm/dd/yy", new Date());
                    //Show navbar
                    $("top-navigation").show();
                    this.datePicker = $(this.elementRef.nativeElement).find('#datepicker');
                    this.datePicker.datepicker({
                        onSelect: function (date) {
                            _this.setDate(date);
                            $(_this.datePicker).hide();
                        }
                    }).hide();
                    this.initSelectOptions();
                    this.update();
                    this.invoice.loadFromServer();
                };
                TodayViewComponent.prototype.update = function () {
                    this.invoice.update();
                };
                TodayViewComponent.prototype.partToPercent = function (part) {
                    return Math.round(part * 100);
                };
                TodayViewComponent.prototype.shareToUSD = function (share) {
                    return (share * this.invoice.declaredTips).toFixed(2);
                };
                TodayViewComponent.prototype.shareToUSDRounded = function (share) {
                    return Math.round(share * this.invoice.declaredTips);
                };
                TodayViewComponent.prototype.formatedUSD = function (amount) {
                    return amount.toFixed(2);
                };
                TodayViewComponent.prototype.initSelectOptions = function () {
                    for (var i = 0; i < 25; i++) {
                        this.partsOfTips[i] = (i + 1) / 100;
                    }
                    for (var i = 0; i < 15; i++) {
                        this.personsOptions[i] = i;
                    }
                };
                TodayViewComponent.prototype.withBonusAfterTipOut = function () {
                    if (!this.invoice.bonus || this.invoice.bonus == 0 || !this.appService.isAdmin) {
                        return "";
                    }
                    else {
                        return "/" + this.invoice.afterTipOutWithBonus;
                    }
                };
                TodayViewComponent.prototype.setDate = function (newDate) {
                    this.invoice.date = $.datepicker.formatDate("D mm/dd/yy", new Date(newDate));
                    this.invoice.loadFromServer();
                };
                TodayViewComponent.prototype.setTotalBarShare = function (share) {
                    this.invoice.bar.totalShare = share;
                    this.update();
                };
                TodayViewComponent.prototype.setTotalFoodrunnersShare = function (share) {
                    this.invoice.foodRunners.totalShare = share;
                    this.update();
                };
                TodayViewComponent.prototype.setTotalKitchenShare = function (share) {
                    this.invoice.kitchen.totalShare = share;
                    this.update();
                };
                TodayViewComponent.prototype.setTotalBarEmployeers = function (persons) {
                    this.invoice.bar.numberOfWorkers = persons;
                    this.update();
                };
                TodayViewComponent.prototype.setTotalFoodrunnerEmployeers = function (persons) {
                    this.invoice.foodRunners.numberOfWorkers = persons;
                    this.update();
                };
                TodayViewComponent.prototype.setTotalKitchenEmployeers = function (persons) {
                    this.invoice.kitchen.numberOfWorkers = persons;
                    this.update();
                };
                TodayViewComponent.prototype.save = function () {
                    this.invoice.save();
                };
                TodayViewComponent.prototype.ngOnDestroy = function () {
                };
                TodayViewComponent = __decorate([
                    core_1.Component({
                        selector: 'today-view',
                        templateUrl: 'app/today-view/today-view.component.html',
                        styleUrls: ['app/today-view/today-view.component.css'],
                        directives: [],
                        providers: [invoice_1.Invoice]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, app_service_1.AppService, core_1.ElementRef, invoice_1.Invoice])
                ], TodayViewComponent);
                return TodayViewComponent;
            }());
            exports_1("TodayViewComponent", TodayViewComponent);
        }
    }
});
//# sourceMappingURL=today-view.component.js.map