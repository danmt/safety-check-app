import { AsyncPipe, NgClass, NgFor } from '@angular/common';
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
      <mat-card class="p-4">
        <header class="mb-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Sites List
          </h2>

          <div>
            <button
              mat-raised-button
              color="primary"
              (click)="openCreateSiteModal()"
            >
              New
            </button>

            <button mat-raised-button (click)="onReloadSites()">Reload</button>
          </div>
        </header>

        <ul>
          <li
            *ngFor="let site of sites$ | async; let last = last"
            class="mb-4 p-4 bg-black bg-opacity-10 border-l-4 border-green-500"
            [ngClass]="{
              'mb-4': !last
            }"
          >
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
          </li>
        </ul>
      </mat-card>
    </section>
  `,
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatCardModule,
  ],
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
