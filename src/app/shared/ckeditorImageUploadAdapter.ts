import { HelperService } from './helper.service';

export class CustomUploadAdapter {
  loader: any;
  xhr: any;

  apiUrl: string;
  folder: string;
  endpoint: string;

  constructor(loader: any, apiUrl: string, folder: string, endpoint: string) {
    this.loader = loader;
    this.apiUrl = apiUrl;
    this.folder = folder;
    this.endpoint = endpoint;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open('POST', `${this.apiUrl}/${this.endpoint}`, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }
      resolve({
        default: `${this.apiUrl}/${this.folder}/${response.url}`,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append('upload', file);
    this.xhr.send(data);
  }
}
