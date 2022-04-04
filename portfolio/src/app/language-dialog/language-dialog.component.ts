import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-language-dialog',
  templateUrl: './language-dialog.component.html',
  styleUrls: ['./language-dialog.component.scss']
})
export class LanguageDialogComponent {
 languages = [
    {value: 'en', viewValue: 'English'},
    {value: 'fr', viewValue: 'Français'},
    {value: 'ar', viewValue: 'عربى'},
    {value: 'ja', viewValue: '日本語'},
    {value: 'zh', viewValue: '中文'},
    {value: 'es', viewValue: 'Español'},
  ];

   constructor(
    public dialogRef: MatDialogRef<LanguageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
