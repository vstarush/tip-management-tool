//Bootstrapping is platform-specific
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {AppService} from './util/app.service';
import {enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(AppComponent,[AppService,HTTP_PROVIDERS]);
