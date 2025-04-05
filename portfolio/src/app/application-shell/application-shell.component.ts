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
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'application-shell',
  templateUrl: './application-shell.component.html',
  styleUrls: ['./application-shell.component.scss'],
  standalone: false
})
export class ApplicationShellComponent {
  // sidenav font awesome icons
  faGlobe = faGlobe;
  faGithubAlt = faGithubAlt;
  faYoutube = faYoutube;
  faLinkedinIn = faLinkedinIn;
  mobileQuery: MediaQueryList;
  @ViewChild('snav', {static: false}) snav: ElementRef;
  darkMode : boolean = !!(sessionStorage.getItem('darkMode')) ? coerceBooleanProperty(sessionStorage.getItem('darkMode')) : true;
  language : string;
  user : any;

  constructor(
      public media: MediaMatcher,
      public dialog: MatDialog,
      private translate: TranslateService,
      public authService: AuthService,
      private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
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

  onProfile() {
    this.router.navigateByUrl('projects/sandbox/profile');
  }

  onLogout() {
    this.authService.logout();
  }

}
