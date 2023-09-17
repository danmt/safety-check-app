import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { provideWalletAdapter } from '@heavy-duty/wallet-adapter';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { AppComponent } from './app/app.component';
import { DeviceDetailsComponent } from './app/device';
import { InspectorDetailsComponent } from './app/inspector';
import { SafetyCheckDetailsComponent } from './app/safety-check';
import { SiteDetailsComponent, SiteListComponent } from './app/site';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      MatDialogModule,
      MatSnackBarModule,
      RouterModule.forRoot([
        { path: 'sites', component: SiteListComponent },
        { path: 'sites/:siteId', component: SiteDetailsComponent },
        {
          path: 'sites/:siteId/devices/:deviceId',
          component: DeviceDetailsComponent,
        },
        {
          path: 'sites/:siteId/devices/:deviceId/safety-checks/:safetyCheckId',
          component: SafetyCheckDetailsComponent,
        },
        {
          path: 'sites/:siteId/inspectors/:publicKey',
          component: InspectorDetailsComponent,
        },
        {
          path: '**',
          redirectTo: 'sites',
        },
      ])
    ),
    provideWalletAdapter({
      autoConnect: true,
      adapters: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    }),
  ],
}).catch((err) => console.error(err));
