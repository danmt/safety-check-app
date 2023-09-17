import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-details',
  template: `
    <div class="p-4" *ngIf="inspector$ | async as inspector">
      <div class="flex gap-1 items-center mb-4">
        <a [routerLink]="['/sites', inspector.siteId]" class="underline">
          {{ inspector.siteId }}
        </a>
        <mat-icon>chevron_right</mat-icon>
        <span>
          {{ inspector.owner.toBase58() }}
        </span>
      </div>

      <section>
        <mat-card class="p-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Inspector Details
          </h2>
          <p>Owner: {{ inspector.owner.toBase58() }}</p>
          <p>Public Key: {{ inspector.publicKey.toBase58() }}</p>
          <p>Site ID: {{ inspector.siteId }}</p>
        </mat-card>
      </section>
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, MatCardModule, MatIconModule],
})
export class InspectorDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _inspectorApiService = inject(InspectorApiService);

  readonly inspector$ = this._inspectorApiService.inspectors$.pipe(
    map(
      (inspectors) =>
        inspectors.find(
          (inspector) =>
            inspector.siteId === this._route.snapshot.paramMap.get('siteId') &&
            inspector.owner.toBase58() ===
              this._route.snapshot.paramMap.get('owner')
        ) ?? null
    )
  );
}
