import { Component, ElementRef, Inject, Injectable, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CuisineService } from "../../services/cuisine.service";
import { HttpEventType, HttpResponse } from "@angular/common/http";

@Component({
  selector: "app-create-business",
  templateUrl: "./create-cuisine.component.html",
  styleUrls: ["./create-cuisine.component.css"]
})
export class CreateCuisineComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  progress: { percentage: number } = { percentage: 0 };
  showProgress: boolean = false;

  cuisineForm: FormGroup | undefined;

  isLoading: boolean = false;

  fileName = "";
  private event: any;

  constructor(
    private dialogRef: MatDialogRef<CreateCuisineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cuisines: any[] },
    private formBuilder: FormBuilder,
    private cuisineService: CuisineService
  ) {
    this.cuisineForm = this.formBuilder.group({
      nameEng: ["", Validators.required],
      nameArb: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.cuisineService.findAll()
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log(res);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
  }

  setFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileInputChange(fileInput: HTMLInputElement, event: any) {
    this.event = event;
    this.fileName = fileInput.files![0].name;
  }

  createCuisine() {

    if (this.data.cuisines.length > 0) {
      // check if the name is already exist in sportTypes arr
      if (this.data.cuisines.some(st =>
        st.nameEng === this.cuisineForm?.get("nameEng")?.value ||
        st.nameArb === this.cuisineForm?.get("nameArb")?.value
      )) {
        alert("This sport type is already exist");
        return;
      }
    }

    this.isLoading = true;

    this.progress.percentage = 0;
    this.showProgress = true;

    const formData = new FormData();
    const files = this.event.target.files;

    // for (let i = 0; i >= files.length; i++) {
    //   formData.append('files', files.item(i));
    // }

    for (let x = 0; x < files.length; x++) {
      formData.append("files", files[x]);
    }

    // files.item.forEach(i => formData.append('files', i));

    files.inProgress = true;
    files.progress = 0;

    const cuisine = {
      nameEng: this.cuisineForm?.get("nameEng")?.value,
      nameArb: this.cuisineForm?.get("nameArb")?.value,
      enable: true
    };

    formData.append("cuisine", JSON.stringify(cuisine));

    this.cuisineService.create(formData)
      .subscribe(event => {
        this.showProgress = true;
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round((event.loaded / event.total) * 100);
          this.showProgress = false;
        } else if (event.type === HttpEventType.Response) {
          this.isLoading = false;
          this.dialogRef.close();
        }
      });
  }
}
