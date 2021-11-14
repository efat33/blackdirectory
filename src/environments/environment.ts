// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // firebaseConfig: {
  //   apiKey: 'AIzaSyBjFVo1o-zoBBRWzo4lUtRpXASvThyCJDU',
  //   authDomain: 'blackdirectory-7027d.firebaseapp.com',
  //   databaseURL: 'https://blackdirectory-7027d-default-rtdb.firebaseio.com',
  //   projectId: 'blackdirectory-7027d',
  //   storageBucket: 'blackdirectory-7027d.appspot.com',
  //   messagingSenderId: '651378609047',
  //   appId: '1:651378609047:web:98491234ef891698dc52d2',
  //   measurementId: 'G-SHF0TC18V0'
  // }

  // Production
  firebaseConfig: {
    apiKey: 'AIzaSyDczz7lOdIJsllrF3EGyH0_RR1FyGArp0k',
    authDomain: 'custom-black-directory.firebaseapp.com',
    projectId: 'custom-black-directory',
    storageBucket: 'custom-black-directory.appspot.com',
    messagingSenderId: '630525649380',
    appId: '1:630525649380:web:53e52a5fc39dd5e8e1e7f1',
    measurementId: 'G-TQX7242629',
    databaseURL: 'https://custom-black-directory-default-rtdb.firebaseio.com/'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
