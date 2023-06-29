import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CreateSiteModalComponent } from './create-site-modal.component';
import { SiteApiService } from './site-api.service';
import { Site } from './site.model';

@Component({
  selector: 'safety-check-app-site-list',
  template: `
    <section class="p-4">
      <h2>Sites</h2>

      <button mat-raised-button color="primary" (click)="openCreateSiteModal()">
        New
      </button>

      <ul>
        <li *ngFor="let site of sites" class="mb-4">
          <mat-card class="p-4">
            <p>
              {{ site.id }}
            </p>
            <p>
              <a
                [routerLink]="['/sites', site.id]"
                class="text-blue-400 underline"
              >
                view details
              </a>
            </p>

            <div>
              <button
                (click)="deleteSite(site.id)"
                mat-raised-button
                color="warn"
              >
                Delete
              </button>
            </div>
          </mat-card>
        </li>
      </ul>
    </section>
  `,
  standalone: true,
  imports: [NgFor, RouterLink, MatButtonModule, MatCardModule],
})
export class SiteListComponent {
  private readonly _siteApiService = inject(SiteApiService);
  private readonly _dialog = inject(MatDialog);

  sites: Site[] = this._siteApiService.getAllSites();

  deleteSite(id: string): void {
    this._siteApiService.deleteSite(id);
  }

  openCreateSiteModal() {
    const dialogRef = this._dialog.open(CreateSiteModalComponent);

    dialogRef.afterClosed().subscribe((newSite: Site) => {
      if (newSite) {
        this._siteApiService.createSite(newSite);
      }
    });
  }
}
