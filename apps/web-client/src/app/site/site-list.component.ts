import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CreateSiteModalComponent } from './create-site-modal.component';
import { SiteApiService } from './site-api.service';

@Component({
  selector: 'safety-check-app-site-list',
  template: `
    <section class="p-4">
      <header class="mb-4">
        <h2>Sites</h2>

        <button
          mat-raised-button
          color="primary"
          (click)="openCreateSiteModal()"
        >
          New
        </button>

        <button mat-raised-button (click)="onReloadSites()">Reload</button>
      </header>

      <ul>
        <li *ngFor="let site of sites$ | async" class="mb-4">
          <mat-card class="p-4">
            <p>ID: {{ site.id }}</p>
            <p>Public Key: {{ site.publicKey.toBase58() }}</p>
            <p>Authority: {{ site.authority.toBase58() }}</p>
            <p>
              <a
                [routerLink]="['/sites', site.id]"
                class="text-blue-400 underline"
              >
                view details
              </a>
            </p>
          </mat-card>
        </li>
      </ul>
    </section>
  `,
  standalone: true,
  imports: [AsyncPipe, NgFor, RouterLink, MatButtonModule, MatCardModule],
})
export class SiteListComponent {
  private readonly _siteApiService = inject(SiteApiService);
  private readonly _dialog = inject(MatDialog);

  readonly sites$ = this._siteApiService.sites$;

  onReloadSites() {
    this._siteApiService.reloadSites();
  }

  openCreateSiteModal() {
    this._dialog.open(CreateSiteModalComponent);
  }
}
