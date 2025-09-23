import { NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

interface Region {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'filter-dialog',
  templateUrl: './filter-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule
  ],
})
export class FilterDialog {
  readonly dialogRef = inject(MatDialogRef<FilterDialog>);
  public data = inject(MAT_DIALOG_DATA);
  private readonly _formBuilder = inject(FormBuilder);
  selectedRegion;
  searchTerm;
  types = this._formBuilder.group({
    Normal: false,
    Water: false,
    Fire: false,
    Grass: false,
    Psychic: false,
    Dark: false,
    Ground: false,
    Bug: false,
    Rock: false,
    Electric: false,
    Fairy: false,
    Fighting: false,
    Steel: false,
    Dragon: false,
    Ice: false,
    Flying: false,
    Ghost: false,
    Poison: false
  });
  regions: Region[] = [
    {value: 'Kanto', viewValue: 'Kanto'},
    {value: 'Johto', viewValue: 'Johto'},
    {value: 'Hoenn', viewValue: 'Hoenn'},
    {value: 'Sinnoh', viewValue: 'Sinnoh'},
    {value: 'Unova', viewValue: 'Unova'},
    {value: 'Kalos', viewValue: 'Kalos'},
  ];

  onApply() {
    this.data.filterPokemon(this.searchTerm, this.selectedRegion, this.types.value);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}