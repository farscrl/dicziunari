import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LocaleDefinedGuard } from './guards/locale-defined.guard';
import { LocaleNotDefinedGuard } from './guards/locale-not-defined.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [LocaleDefinedGuard],
  },
  {
    path: 'language',
    loadChildren: () => import('./language-selection/language-selection.module').then((m) => m.LanguageSelectionPageModule),
    canActivate: [LocaleNotDefinedGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
