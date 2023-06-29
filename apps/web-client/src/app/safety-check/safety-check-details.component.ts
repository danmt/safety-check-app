import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SafetyCheckApiService } from './safety-check-api.service';

@Component({
  selector: 'safety-check-app-safety-check-details',
  template: `
    <section class="flex flex-wrap gap-4 p-4">
      <div class="basis-full">
        <h2>Safety Check Details</h2>

        <mat-card class="p-4" *ngIf="safetyCheck$ | async as safetyCheck">
          <p>ID: {{ safetyCheck.id }}</p>
          <p>Public Key: {{ safetyCheck.publicKey.toBase58() }}</p>
          <p>Site ID: {{ safetyCheck.siteId }}</p>
        </mat-card>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, AsyncPipe, MatCardModule],
})
export class SafetyCheckDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _safetyCheckApiService = inject(SafetyCheckApiService);

  readonly safetyCheck$ = this._safetyCheckApiService.safetyChecks$.pipe(
    map(
      (safetyChecks) =>
        safetyChecks.find(
          (safetyCheck) =>
            safetyCheck.id ===
            this._route.snapshot.paramMap.get('safetyCheckId')
        ) ?? null
    )
  );
}
