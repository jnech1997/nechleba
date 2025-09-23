import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule as MatListModule } from '@angular/material/list';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { ApplicationShellComponent } from './application-shell/application-shell.component';
import { MatDialogModule as MatDialogModule } from '@angular/material/dialog';
import { LanguageDialogComponent } from './language-dialog/language-dialog.component';
import { MatSelectModule as MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TranslateService } from '@ngx-translate/core';
import { ProjectsModule } from './projects/projects.module';
import { AuthService } from './services/auth.service';
import { ServerService } from './services/server.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthInterceptor } from './interceptors/http.auth-interceptor';
import { AuthErrorInterceptor } from './interceptors/http.auth-error-interceptor';

@NgModule({
    declarations: [
        AppComponent,
        ApplicationShellComponent,
        LanguageDialogComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        FontAwesomeModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ProjectsModule
    ],
    providers: [
        TranslateService, 
        AuthService, 
        ServerService,
        provideHttpClient(withInterceptors([AuthInterceptor, AuthErrorInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
