import {Component, ElementRef, ViewChild} from '@angular/core';
import {HeaderImagesService} from "../../services/header-images.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-header-images',
  templateUrl: './create-header-images.component.html',
  styleUrls: ['./create-header-images.component.css']
})
export class CreateHeaderImagesComponent {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  fileName = "";
  private event: any;

  headerImagesFormGroup: FormGroup | undefined;

  // {link: string, linkType: enum(EXTERNAL, INTERNAL), type: enum(ACADEMY, EVENT)}

  constructor(
    private dialogRef: MatDialogRef<CreateHeaderImagesComponent>,
    private headerImagesService: HeaderImagesService,
    private formBuilder: FormBuilder
  ) {

    this.headerImagesFormGroup = this.formBuilder.group({
      link: ["", Validators.required],
      linkType: ["", Validators.required],
      type: ["", Validators.required],
      order: [0, Validators.required]
    });
  }

  setFile(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileInputChange(fileInput: HTMLInputElement, event: any, headerImageImg: HTMLImageElement) {
    this.event = event;
    this.fileName = fileInput.files![0].name;
    headerImageImg.src = URL.createObjectURL(fileInput.files![0]);
  }

  createHeaderImage() {

    const formData = new FormData();
    const files = this.event.target.files;

    for (let x = 0; x < files.length; x++) {
      formData.append("files", files[x]);
    }

    // files.item.forEach(i => formData.append('files', i));

    files.inProgress = true;
    files.progress = 0;

    formData.append("headerImage", JSON.stringify(this.headerImagesFormGroup?.value));

    this.headerImagesService.create(formData).subscribe({
      next: (data: any) => {
        this.dialogRef.close();
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }
}
