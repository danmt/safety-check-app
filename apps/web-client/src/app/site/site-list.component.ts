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
    <section>
      <header
        class="w-full h-64 bg-[url('assets/images/sites-list-hero.png')] bg-cover flex items-end"
      >
        <div class="w-full px-8 py-4 bg-black bg-opacity-30">
          <h2 class="text-4xl mb-2">Sites List</h2>
          <div>
            <button
              mat-raised-button
              color="primary"
              (click)="openCreateSiteModal()"
            >
              New
            </button>
          </div>
        </div>
      </header>

      <ul class="p-4">
        <li *ngFor="let site of sites$ | async; let last = last">
          <mat-card
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
          </mat-card>
        </li>
      </ul>
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

  openCreateSiteModal() {
    this._dialog.open(CreateSiteModalComponent);
  }
}
