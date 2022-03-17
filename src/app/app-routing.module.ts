import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth/auth-guard';

import { LoginComponent } from './auth/login/login.component';
import { EditExamsComponent } from './edit-exams/edit-exams.component';
import { MarkdownRendererComponent } from './markdown/markdown-renderer/markdown-renderer.component';
import { PracticalComponent } from './training/current-training/practical/practical.component';
import { PastTrainingComponent } from './training/past-training/past-training.component';
import { TrainingComponent } from './training/training.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'new-training', component: TrainingComponent},
  { path: 'practical', component: PracticalComponent, canActivate: [AuthGaurd] },
  { path: 'past', component: PastTrainingComponent, canActivate: [AuthGaurd] },
  { path: 'dpe', component: MarkdownRendererComponent, canActivate: [AuthGaurd] },
  { path: 'edit-exams', component: EditExamsComponent, canActivate: [AuthGaurd] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AppRoutingModule { }
