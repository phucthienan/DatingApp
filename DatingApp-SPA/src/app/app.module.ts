import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import {
  BsDatepickerModule,
  BsDropdownModule,
  ButtonsModule,
  ModalModule,
  PaginationModule,
  TabsModule,
} from 'ngx-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { PhotoManagementComponent } from './components/admin/photo-management/photo-management.component';
import { RolesModalComponent } from './components/admin/roles-modal/roles-modal.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { MemberMessagesComponent } from './components/members/member-messages/member-messages.component';
import { MembersComponent } from './components/members/members.component';
import { PhotoEditorComponent } from './components/members/photo-editor/photo-editor.component';
import { MessagesComponent } from './components/messages/messages.component';
import { NavComponent } from './components/nav/nav.component';
import { RegisterComponent } from './components/register/register.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './resolvers/lists.resolver';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { MembersResolver } from './resolvers/members.resolver';
import { MessagesResolver } from './resolvers/messages.resolver';
import { appRoutes } from './routes';
import { AdminService } from './services/admin.service';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { ErrorInterceptorProvider } from './services/error.interceptor';
import { UserService } from './services/user.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    HomeComponent,
    MembersComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberMessagesComponent,
    MemberEditComponent,
    ListsComponent,
    MessagesComponent,
    PhotoEditorComponent,
    TimeAgoPipe,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
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
    ButtonsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    AuthService,
    AlertifyService,
    UserService,
    AdminService,
    ErrorInterceptorProvider,
    AuthGuard,
    PreventUnsavedChangesGuard,
    MembersResolver,
    MemberDetailResolver,
    MemberEditResolver,
    ListsResolver,
    MessagesResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [RolesModalComponent]
})
export class AppModule { }
