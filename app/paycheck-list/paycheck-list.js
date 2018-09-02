System.register(['angular2/core', 'angular2/http', 'rxjs/Rx', '../invoice/invoice', '../paycheck/paycheck'], function(exports_1, context_1) {
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
    var core_1, http_1, invoice_1, paycheck_1;
    var PaycheckList;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (invoice_1_1) {
                invoice_1 = invoice_1_1;
            },
            function (paycheck_1_1) {
                paycheck_1 = paycheck_1_1;
            }],
        execute: function() {
            PaycheckList = (function () {
                function PaycheckList(http, paycheck) {
                    this.http = http;
                    this.paycheck = paycheck;
                }
                //Load paychecks from db   
                PaycheckList.prototype.loadPaycheckList = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var headers = new http_1.Headers();
                        headers.append('Content-Type', 'application/json');
                        _this.http.get('/api/v1/paychecks', {
                            headers: headers
                        })
                            .map(function (response) { return response.json(); })
                            .subscribe(function (data) {
                            var paychecks = _this.jsonToArrayOfPaychecks(data);
                            resolve(paychecks);
                        }, function (err) {
                            reject(err.json().message);
                        }, function () { });
                    });
                };
                //Save paychecks to db
                PaycheckList.prototype.save = function (paychecks) {
                    var paycheckDateRanges = this.arrayOfPaychecksToDateRanges(paychecks);
                    var paychecksJSON = { dateRanges: paycheckDateRanges };
                    var stringData = JSON.stringify(paychecksJSON);
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('/api/v1/paychecks', stringData, {
                        headers: headers
                    })
                        .subscribe(function (data) {
                        // console.log(data);
                    }, function (err) { return console.log(err); }, function () {
                        //console.log("paycheckList loaded")
                    });
                };
                //Convert pairs [{startDate;endDate}] to array of Paycheck
                PaycheckList.prototype.jsonToArrayOfPaychecks = function (_data) {
                    _data = _data || { dateRanges: [] };
                    var arrayOfPaychecks = [];
                    var dateRanges = _data["dateRanges"];
                    for (var i = 0; i < dateRanges.length; i++) {
                        //dataRange is look like {startDate;endDate}
                        var dataRange = dateRanges[i];
                        dataRange.startDate = new Date(dataRange.startDate);
                        dataRange.endDate = new Date(dataRange.endDate);
                        arrayOfPaychecks[i] = this.paycheck.newPaycheckWithDateRange(dataRange);
                    }
                    return arrayOfPaychecks;
                };
                //Convert paychecks to it's date ranges ( [{startDate;endDate}] )
                PaycheckList.prototype.arrayOfPaychecksToDateRanges = function (_arrayOfPaychecks) {
                    var _paycheckDateRanges = [];
                    for (var i = 0; i < _arrayOfPaychecks.length; i++) {
                        var _startDate = _arrayOfPaychecks[i].startDate;
                        var _endDate = _arrayOfPaychecks[i].endDate;
                        _paycheckDateRanges[i] = {
                            startDate: _startDate,
                            endDate: _endDate
                        };
                    }
                    return _paycheckDateRanges;
                };
                PaycheckList = __decorate([
                    core_1.Component({
                        providers: [invoice_1.Invoice, http_1.Http]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, paycheck_1.Paycheck])
                ], PaycheckList);
                return PaycheckList;
            }());
            exports_1("PaycheckList", PaycheckList);
        }
    }
});
//# sourceMappingURL=paycheck-list.js.map