import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-details',
  template: `
    <section class="flex flex-wrap gap-4 p-4">
      <div class="basis-full">
        <h2>Inspector Details</h2>

        <mat-card class="p-4" *ngIf="inspector$ | async as inspector">
          <p>Owner: {{ inspector.owner.toBase58() }}</p>
          <p>Public Key: {{ inspector.publicKey.toBase58() }}</p>
          <p>Site ID: {{ inspector.siteId }}</p>
        </mat-card>
      </div>
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
            inspector.owner.toBase58() ===
            this._route.snapshot.paramMap.get('owner')
        ) ?? null
    )
  );
}
