import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-details',
  template: `
    <section class="p-4">
      <mat-card class="p-4" *ngIf="inspector$ | async as inspector">
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
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe, MatCardModule],
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
