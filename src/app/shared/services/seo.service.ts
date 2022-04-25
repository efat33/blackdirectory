import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HelperService } from '../helper.service';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    public helperService: HelperService,
  ) {}

  generateTags(config) {

    const siteUrl = this.helperService.siteUrl;

    // default values
    config = { 
      title: 'Black Directory', 
      description: 'Black Directory', 
      image: 'https://www.blackdirectory.co.uk/assets/img/BD-LOGO.png',
      slug: '',
      keywords: '',
      ...config
    }

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: 'Black Directory' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Black Directory' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: `${siteUrl}/${config.slug}` });
  }
  
}
