import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class SnackBarService {

constructor(private snackBar:MatSnackBar) { }

    openSnackBar(message: string, action?: string, classes?: string) {
        this.snackBar.open(message, action || '', {
            duration: action ? undefined : 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: classes ? ['mat-toolbar', `mat-${classes}`] : ['mat-toolbar', `mat-primary`]
        });
    }

}
