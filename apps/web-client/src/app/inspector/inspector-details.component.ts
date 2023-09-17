import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HdObscureAddressPipe } from '@heavy-duty/wallet-adapter-cdk';
import { map } from 'rxjs';
import { InspectorApiService } from './inspector-api.service';

@Component({
  selector: 'safety-check-app-inspector-details',
  template: `
    <section *ngIf="inspector$ | async as inspector">
      <header
        class="w-full h-64 bg-[url('assets/images/inspector-details-hero.png')] bg-cover flex items-end"
      >
        <div class="w-full px-8 py-4 bg-black bg-opacity-50">
          <h2 class="text-4xl">Inspector Details</h2>
          <div class="flex gap-1 items-center">
            <a [routerLink]="['/']" class="underline"> Home </a>
            <mat-icon>chevron_right</mat-icon>
            <a [routerLink]="['/sites', inspector.siteId]" class="underline">
              {{ inspector.siteId }}
            </a>
            <mat-icon>chevron_right</mat-icon>
            <span>
              {{ inspector.publicKey.toBase58() | hdObscureAddress }}
            </span>
          </div>
        </div>
      </header>

      <div class="p-4">
        <mat-card class="p-4">
          <h2
            class="pl-4 py-2 bg-black bg-opacity-10 border-l-4 border-teal-400 text-xl mb-2"
          >
            Info
          </h2>
          <p>Owner: {{ inspector.owner.toBase58() }}</p>
          <p>Public Key: {{ inspector.publicKey.toBase58() }}</p>
          <p>Site ID: {{ inspector.siteId }}</p>
        </mat-card>
      </div>
    </section>
  `,
  styleUrls: [],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    HdObscureAddressPipe,
  ],
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
            inspector.publicKey.toBase58() ===
              this._route.snapshot.paramMap.get('publicKey')
        ) ?? null
    )
  );
}
