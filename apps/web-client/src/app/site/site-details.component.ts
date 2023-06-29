import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DeviceListComponent } from '../device';
import { InspectorListComponent } from '../inspector';
import { SiteApiService } from './site-api.service';

@Component({
  selector: 'safety-check-app-site-details',
  template: `
    <section class="flex flex-wrap gap-4 p-4">
      <div class="basis-full">
        <h2>Site Details</h2>

        <mat-card class="p-4" *ngIf="site$ | async as site">
          <p>ID: {{ site.id }}</p>
          <p>Public Key: {{ site.publicKey.toBase58() }}</p>
          <p>Authority: {{ site.authority.toBase58() }}</p>
        </mat-card>
      </div>

      <div>
        <safety-check-app-device-list></safety-check-app-device-list>
      </div>

      <div>
        <safety-check-app-inspector-list></safety-check-app-inspector-list>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatCardModule,
    DeviceListComponent,
    InspectorListComponent,
  ],
})
export class SiteDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _siteApiService = inject(SiteApiService);

  readonly site$ = this._siteApiService.sites$.pipe(
    map(
      (sites) =>
        sites.find(
          (site) => site.id === this._route.snapshot.paramMap.get('siteId')
        ) ?? null
    )
  );
}
