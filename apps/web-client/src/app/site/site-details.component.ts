import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceListComponent } from '../device';
import { SiteApiService } from './site-api.service';
import { Site } from './site.model';

@Component({
  selector: 'safety-check-app-site-details',
  template: `
    <h2>Site Details</h2>

    <div *ngIf="site">
      <p>ID: {{ site.id }}</p>
      <!-- Display other site properties -->
    </div>

    <div>
      <safety-check-app-device-list></safety-check-app-device-list>
    </div>
  `,
  styleUrls: [],
  standalone: true,
  imports: [NgIf, DeviceListComponent],
})
export class SiteDetailsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _siteApiService = inject(SiteApiService);

  site: Site | null = null;

  ngOnInit(): void {
    const siteId = this._route.snapshot.paramMap.get('siteId');
    if (siteId) {
      this.site = this._siteApiService.getSiteById(siteId) ?? null;
    }
  }
}
