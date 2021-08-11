import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CurrentUser } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  currentUserInfo: CurrentUser;
  apiUrl = 'http://localhost:3000';
  siteUrl = 'http://localhost:4200';
  assetUrl = 'http://localhost:4200/assets';

  constructor(private http: HttpClient) {
    this.setCurrentUserInfo();
  }

  getClientIP() {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      return res.ip;
    });
  }

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const dir = toIndex > fromIndex ? 1 : -1;

    const item = formArray.at(fromIndex);
    for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(toIndex, item);
  }

  isUserLoggedIn(): boolean {
    const currentUserStr = localStorage.getItem('currentUserInfo');
    try {
      if (JSON.parse(currentUserStr)) return true;
    } catch (e) {
      return false;
    }
    return false;
  }

  setCurrentUserInfo(): void {
    const currentUserStr = localStorage.getItem('currentUserInfo');
    try {
      if (JSON.parse(currentUserStr)) this.currentUserInfo = JSON.parse(currentUserStr);
    } catch (e) {}
  }

  getMetaData(data, key): any {
    return data.find((element) => element.meta_key == key).meta_value;
  }

  prepareMetaData(data): any {
    const metaData = {};
    for (const item of data) {
      metaData[item.meta_key] = item.meta_value;
    }
    return metaData;
  }

  imageValidation(image: File): any {
    const obj = {
      validated: true,
      message: 'Supported image type are png, jpg, jpeg and image size cannot be greater than 1MB',
    };

    if (
      (image.type != 'image/jpeg' && image.type != 'image/png' && image.type != 'image/jpg') ||
      image.size / (1024 * 1024) > 1
    ) {
      obj.validated = false;
    }

    return obj;
  }

  fileValidation(file: File): any {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

    const obj = {
      validated: true,
      message: 'Supported file type are doc, docx, pdf and file size cannot be greater than 5MB',
    };

    if ((ext != 'pdf' && ext != 'doc' && ext != 'docx') || file.size / (1024 * 1024) > 5) {
      obj.validated = false;
    }

    return obj;
  }

  getImageUrl(imageName: string, folder: string, imgSize?: string): string {
    const size = imgSize ? imgSize : 'full';

    let image = imageName;

    if (size != 'full') {
      image = `${size}-${image}`;
    }

    return `${this.apiUrl}/${folder}/${image}`;
  }

  isEmployer() {
    return this.currentUserInfo?.role === 'employer';
  }

  isCandidate() {
    return this.currentUserInfo?.role === 'candidate';
  }

  isAdmin() {
    return this.currentUserInfo?.role === 'admin';
  }

  isAdminOrEmployer() {
    return this.isAdmin() || this.isEmployer();
  }

  dateTimeNow() {
    const currentdate = new Date();

    const year = currentdate.getUTCFullYear();
    const month = (currentdate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = currentdate.getUTCDate().toString().padStart(2, '0');
    const hour = currentdate.getUTCHours().toString().padStart(2, '0');
    const min = currentdate.getUTCMinutes().toString().padStart(2, '0');
    const sec = currentdate.getUTCSeconds().toString().padStart(2, '0');

    const datetime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

    return datetime;
  }
}
