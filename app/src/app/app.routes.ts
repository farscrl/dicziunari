import { Routes } from '@angular/router';
import { LocaleDefinedGuard } from './guards/locale-defined.guard';
import { LocaleNotDefinedGuard } from './guards/locale-not-defined.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [LocaleDefinedGuard],
    children: [
      {
        path: 'tabs',
        loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
        children: [
          {
            path: 'search',
            children: [
              {
                path: '',
                loadComponent: () => import('./search/search.page').then((m) => m.SearchPage),
              },
              {
                path: 'detail/:id',
                loadComponent: () => import('./search/search-detail/search-detail.page').then((m) => m.SearchDetailPage),
              },
            ],
          },
          {
            path: 'favourites',
            children: [
              {
                path: '',
                loadComponent: () => import('./favourites/favourites.page').then((m) => m.FavouritesPage),
              },
              {
                path: 'detail/:id',
                loadComponent: () =>
                  import('./favourites/favourites-detail/favourites-detail.page').then((m) => m.FavouritesDetailPage),
              },
            ],
          },
          {
            path: 'settings',
            children: [
              {
                path: '',
                loadComponent: () => import('./settings/settings.page').then((m) => m.SettingsPage),
              },
              {
                path: 'feedback',
                loadComponent: () => import('./settings/feedback/feedback.page').then((m) => m.FeedbackPage),
              },
              {
                path: 'help',
                loadComponent: () => import('./settings/help/help.page').then((m) => m.HelpPage),
              },
              {
                path: 'info',
                loadComponent: () => import('./settings/info/info.page').then((m) => m.InfoPage),
              },
            ],
          },
          {
            path: '',
            redirectTo: '/tabs/search',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/search',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'language',
    canActivate: [LocaleNotDefinedGuard],
    loadComponent: () => import('./language-selection/language-selection.page').then((m) => m.LanguageSelectionPage),
  },
];