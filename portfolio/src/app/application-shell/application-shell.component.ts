import {
    Component,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { LanguageDialogComponent } from '../language-dialog/language-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'application-shell',
  templateUrl: './application-shell.component.html',
  styleUrls: ['./application-shell.component.scss'],
  standalone: false
})
export class ApplicationShellComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild('snav', {static: false}) snav: ElementRef;
  darkMode : boolean = !!(sessionStorage.getItem('darkMode')) ? coerceBooleanProperty(sessionStorage.getItem('darkMode')) : true;
  language : string;
  user : any;

  constructor(
      changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher,
      public dialog: MatDialog,
      private translate: TranslateService,
      public authService: AuthService,
      private server: ServerService,
      private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LanguageDialogComponent, {
      width: '250px',
      data: {language: this.language}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.language = result;
      if (!!this.language) {
        this.translate.use(this.language);
        window.sessionStorage.setItem('language', this.language);
      }
    });
  }

  onModeChange() {
    this.darkMode = !this.darkMode;
    window.sessionStorage.setItem('darkMode', String(this.darkMode));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onProfile() {
    this.router.navigateByUrl('projects/sandbox/profile');
  }

  onLogout() {
    this.authService.logout();
  }

}
