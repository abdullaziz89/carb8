import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HeaderImagesService} from "../services/header-images.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateHeaderImagesComponent} from "./create-header-images/create-header-images.component";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-header-images',
  templateUrl: './header-images.component.html',
  styleUrls: ['./header-images.component.css']
})
export class HeaderImagesComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef | undefined;

  fileName = "";
  private event: any;

  headerImages: any[] = [];

  // {link: string, linkType: enum(EXTERNAL, INTERNAL), type: enum(ACADEMY, EVENT)}

  constructor(
    private headerImagesService: HeaderImagesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllHeaderImages();
  }

  getAllHeaderImages() {
    this.headerImagesService.findAll().subscribe({
      next: (data: any) => {
        this.headerImages = data;
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }

  openCreateHeaderImage() {
    const dialogRef = this.dialog.open(CreateHeaderImagesComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.getAllHeaderImages();
    });
  }

  deleteHeaderImage(id: any) {
    this.headerImagesService.remove(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.headerImages = this.headerImages.filter((headerImage: any) => headerImage.id !== id);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log("complete");
      }
    });
  }

  goToLink(link: string) {
    window.open(this.urlFormatter(link), "_blank");
  }

  urlFormatter(url: string) {
    return url === '/' ? environment.clientUrl :`${environment.clientUrl}/${url}`;
  }
}
