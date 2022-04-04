import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationShellComponent } from './application-shell/application-shell.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LanguageDialogComponent } from './language-dialog/language-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TranslateService } from '@ngx-translate/core';
import { DataVisualizationsComponent } from './data-visualizations/data-visualizations.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';
import { SandboxModule } from './sandbox/sandbox.module';

@NgModule({
    declarations: [
        AppComponent,
        ApplicationShellComponent,
        AboutComponent,
        ProjectsComponent,
        LanguageDialogComponent,
        HomeComponent,
        DataVisualizationsComponent,
        DataVisualizationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        // ngx-translate and the loader module
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SandboxModule
    ],
    providers: [TranslateService],
    bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
