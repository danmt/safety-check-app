import { DialogModule } from '@angular/cdk/dialog';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { AppComponent } from './app/app.component';
import { DeviceDetailsComponent } from './app/device';
import { SiteDetailsComponent, SiteListComponent } from './app/site';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      DialogModule,
      RouterModule.forRoot([
        { path: 'sites', component: SiteListComponent },
        { path: 'sites/:siteId', component: SiteDetailsComponent },
        {
          path: 'sites/:siteId/devices/:deviceId',
          component: DeviceDetailsComponent,
        },
        {
          path: '**',
          redirectTo: 'sites',
        },
      ])
    ),
    provideWalletAdapter({
      autoConnect: true,
      adapters: [new PhantomWalletAdapter()],
    }),
  ],
}).catch((err) => console.error(err));
