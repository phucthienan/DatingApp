import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule, BsDropdownModule, ButtonsModule, PaginationModule, TabsModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { MembersComponent } from './components/members/members.component';
import { PhotoEditorComponent } from './components/members/photo-editor/photo-editor.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { MembersResolver } from './resolvers/members.resolver';
import { appRoutes } from './routes';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { ErrorInterceptorProvider } from './services/error.interceptor';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    HomeComponent,
    MembersComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    ListsComponent,
    MessagesComponent,
    PhotoEditorComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    NgxGalleryModule,
    FileUploadModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [
    AuthService,
    AlertifyService,
    UserService,
    ErrorInterceptorProvider,
    AuthGuard,
    PreventUnsavedChangesGuard,
    MembersResolver,
    MemberDetailResolver,
    MemberEditResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
