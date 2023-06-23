import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateImageResponse } from 'src/app/models/createImageResponse.model';
import { ImageService } from "src/app/services/image/image.service";
import Swal, { SweetAlertResult } from 'sweetalert2'
import { SizeFile } from 'src/app/pipes/sizeFileConvert.pipe';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.css']
})
export class DialogImageComponent {
  isLoading: boolean = false;
  isReady: boolean = false;
  loadingPercentage: number = 0;
  fileUpLoaded: File;
  srcImageUpLoad: string | ArrayBuffer;
  acceptedFiles: string = "image/png, image/gif, image/jpeg";
  createImageResponse: CreateImageResponse;

  constructor(
    public dialogRef: MatDialogRef<DialogImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private imageService: ImageService,
    private sizeFile:SizeFile
  ) { }
  


  onFileSelected(event: Event) {
    
    let file: File = (event.target as HTMLInputElement).files[0];

    if (!file.type.includes('image')) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Solo se aceptan imagenes',
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }

    if (this.sizeFile.transform(file.size) > 5) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'La imagen no puede superar los 5MB de Tamaño',
        showConfirmButton: false,
        timer: 2500
      });
      return;
    }

    if (file) {
      this.fileUpLoaded = file;

      const fileReader: FileReader = new FileReader();

      fileReader.readAsDataURL(file);
      
      fileReader.onloadstart = (e: ProgressEvent<FileReader>) => {
        this.isLoading = true;
      };

      fileReader.onprogress = (e: ProgressEvent<FileReader>) => {

        let progress = parseFloat( ((e.loaded / e.total) * 100).toString());
        this.loadingPercentage = progress;
        
        setTimeout(() => {
          this.isLoading = false;
          this.isReady = true;
        }, 100);
        
      };

      fileReader.onloadend = (e: ProgressEvent<FileReader>) => {

        this.srcImageUpLoad = e.target.result;
        let formData = new FormData();
        formData.append('imagen', file);
        
        this.imageService.createImage(formData)
        .subscribe({
          next: (data: CreateImageResponse) => {
            this.createImageResponse = data;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `${data.message}. La url de la imagen es: ${data.url_image}`,
              showConfirmButton: true,
            });

            this.dialogRef.close(this.createImageResponse.url_image);

            
          },
          error: (err: CreateImageResponse) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: err.message,
              showConfirmButton: true,
            });
            this.dialogRef.close("");
          }
        });
        
      };  

    }
    
  }

  
  
  close() {
    this.dialogRef.close("")
  }


}
