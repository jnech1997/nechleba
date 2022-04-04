import { Component, LOCALE_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  languageList = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Espanol' },
    { code: 'fr', label: 'Français' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ar', label: 'عربى' }
  ];

  constructor(@Inject(LOCALE_ID) protected localeId: string, private translate: TranslateService) {
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    const sessionLang = window.sessionStorage.getItem('language');
    const lang = !!sessionLang ? sessionLang : browserLang.match(/en|fr|es|zh|ja|ar/) ? browserLang : 'en';
    translate.use(lang);
  }
}