import { Injectable } from '@angular/core';
import { Site } from './site.model';

@Injectable({
  providedIn: 'root',
})
export class SiteApiService {
  private sites: Site[] = []; // Assuming you have an array to store sites

  getAllSites(): Site[] {
    return this.sites;
  }

  getSiteById(id: string): Site | undefined {
    return this.sites.find((site) => site.id === id);
  }

  createSite(site: Site): void {
    this.sites.push(site);
  }

  updateSite(site: Site): void {
    const index = this.sites.findIndex((s) => s.id === site.id);
    if (index !== -1) {
      this.sites[index] = site;
    }
  }

  deleteSite(id: string): void {
    const index = this.sites.findIndex((site) => site.id === id);
    if (index !== -1) {
      this.sites.splice(index, 1);
    }
  }
}
