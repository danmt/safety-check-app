import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-details',
  template: `
    <h2>Inspector Details</h2>

    <div *ngIf="inspector$ | async as inspector">
      <p>Owner: {{ inspector.owner.toBase58() }}</p>
      <!-- Display other inspector properties -->
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe],
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
