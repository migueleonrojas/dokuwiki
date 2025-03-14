import { Component, Directive, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/* import tags from 'src/assets/tags.json'; */
import tags from 'src/assets/tags';


import { Tag } from 'src/app/models/tag.model';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageService } from 'src/app/services/page/page.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { CreatePageResponse } from 'src/app/models/createPageResponse.model';
import Swal, { SweetAlertResult } from 'sweetalert2'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogImageComponent } from 'src/app/components/dialog-image/dialog-image.component';
import { Category } from 'src/app/models/category';
import { GetAllCategoryResponse } from 'src/app/models/getAllCategoryResponse';
import { CanDeactivateType } from 'src/app/types/can-deactivate-type.type';
import { CanComponentDeactivate } from 'src/app/models/CanComponentDeactivate.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css'],
})
export class CreatePageComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('textArea') textAreaElement: ElementRef<HTMLTextAreaElement>;
  formMetaDataPage: FormGroup;
  titlePageControl = new FormControl('', [Validators.required, Validators.maxLength(500)]);
  nameUserControl = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  typePageControl = new FormControl('', [Validators.required]);
  categoryControl = new FormControl('', [Validators.required]);

  formCreatePage: FormGroup;
  tagsControl = new FormControl('');
  alignsControl = new FormControl('');
  contentEdit = new FormControl('',[Validators.required, Validators.maxLength(8000)]);
  cursorPositionRow: number = 0;
  allTagsSyntax: RegExpMatchArray | null;
  renderContent: string;
  selectableTags: Tag[] = tags.sort((a, b) => (a.nameTag > b.nameTag) ? 1 : ((b.nameTag > a.nameTag) ? -1 : 0));
  filteredTags: Observable<Tag[]>;
  types_of_pages: {name:string, value:string}[] = [
    {name: 'Documentación', value: 'documentación'},
    {name: 'Incidente',     value: 'incidente'},
  ];
  categories: Category[] = [];

  
  constructor(
    private location: Location,
    private el: ElementRef,
    private pageService: PageService,
    public dialog: MatDialog,
    private categoryService:CategoryService,
    private router:Router
    
  ) {
    this.formBuilds();
  }
  
  async canDeactivate() {

    if(this.formCreatePage.controls['contentEdit'].value.length === 0){
      return true
    }

    let result: SweetAlertResult = await Swal.fire({
      title: '¡Hay contenido en la página a crear!\n ¿Deseas salir sin crear la página?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })

    if (result.isConfirmed) return true;
    else{
      return false;
    }
    
    
  };

  @HostListener('window:beforeunload', ['$event'])
  validateCreatePage(event:BeforeUnloadEvent){

    if(event && this.formCreatePage.controls['contentEdit'].value.length !== 0){
      event.preventDefault();
      event.returnValue = false;
    }
    
  
  }

  @HostListener('document:click', ['$event'])
  getRowLineCursor(event: PointerEvent ){
   if(event.target instanceof HTMLTextAreaElement){
    
    let textAreaElement: HTMLTextAreaElement = event.target;
    let patternTags = {
      patternSimpleTag: '\/[a-zA-Z0-9 ]+\/',
      patternTagNoAttributes: '[a-zA-Z0-9 ]{1,} = "([\&\t\n\'\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"',
      patternTagWithAttributes: '[a-zA-Z ]{0,} = \/"([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/( \/[a-zA-Z]{0,}="([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/){1,}',
      patternTagWithElements: '[a-zA-Z ]{0,} >(( |-)\/[a-zA-Z]{1,}="([\&\t\n\'\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/){1,}'
    }
    let tagsSyntax: RegExpMatchArray;
    tagsSyntax = textAreaElement.value.match(new RegExp(`(${patternTags.patternTagWithAttributes}|${patternTags.patternTagNoAttributes}|${patternTags.patternSimpleTag}|${patternTags.patternTagWithElements})`, 'g')); 
    
   }
  }

  @HostListener('document:keydown', ['$event'])
  
  inputListener(event: KeyboardEvent){
    
    
    if(event.target instanceof HTMLTextAreaElement){
      if(event.key === 'Tab'){
        event.preventDefault();
      }
    }
  }
  



  ngOnInit(): void {

    this.categoryService.getAllCategories().subscribe((data:GetAllCategoryResponse) => {
     this.categories= data.categories;
    });
   
    this.filteredTags = this.formCreatePage.controls['tagsControl'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === "string" ? value : value.nameTag),
      map(nameTag => nameTag ? this._filter(nameTag): this.selectableTags.slice())
    );
    
    this.formCreatePage.controls['contentEdit'].valueChanges.subscribe((data => this.changeContentRendered(data)));
  }
  
  private _filter(value: string): Tag[]{
    const filterValue = value.toLowerCase();
    return this.selectableTags.filter(tag => tag.nameTag.toLowerCase().includes(filterValue));
  } 


  formBuilds() {

    this.formMetaDataPage = new FormGroup({
      titlePageControl: this.titlePageControl,
      nameUserControl:  this.nameUserControl,
      typePageControl:  this.typePageControl,
      categoryControl:  this.categoryControl
    });

    this.formCreatePage = new FormGroup({
      tagsControl: this.tagsControl,
      alignsControl: this.alignsControl,
      contentEdit: this.contentEdit,
    });

  }

  changeContentRendered(contentEditValue: string) {

    let patternTags = {

      patternSimpleTag: '\/[a-zA-Z0-9 ]+\/',
      patternTagNoAttributes: '[a-zA-Z0-9 ]{1,} = "([\&\t\n\'\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"',
      patternTagWithAttributes: '[a-zA-Z ]{0,} = \/"([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/( \/[a-zA-Z]{0,}="([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/){1,}',
      patternTagWithElements: '[a-zA-Z ]{0,} >(( |-)\/[a-zA-Z]{1,}="([\&\t\n\'\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"\/){1,}'
    }

    
    this.allTagsSyntax = contentEditValue.match(new RegExp(`(${patternTags.patternTagWithAttributes}|${patternTags.patternTagNoAttributes}|${patternTags.patternSimpleTag}|${patternTags.patternTagWithElements})`, 'g')); 

    

    let contentInHTML: string = "";
    
    if (this.allTagsSyntax) {

      
      for (let tagSyntax of this.allTagsSyntax) {
        
       let contentValue = tagSyntax.match(new RegExp('"([\&\t\n\'\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"', 'g'));
        
        let tag = this.selectableTags.filter(tag => new RegExp(tag.syntaxUser).test(tagSyntax))[0];

        
        try {
          
          if (new RegExp(`${patternTags.patternTagNoAttributes}`).test(tagSyntax)) {

            contentInHTML += tag.tagAndContent.replace("innerContent", contentValue[0].replaceAll("\"", "")) +  ' ';

          }
          else if (new RegExp(`${patternTags.patternTagWithAttributes}`).test(tagSyntax)) { 

           contentValue = tagSyntax.match(new RegExp('"([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"', 'g'));
          
           contentInHTML += tag.tagAndContent.replace("innerContent", contentValue[0].replaceAll('"',"")).replace("value", `${contentValue[1]}`) + " ";

          }

          else if (new RegExp(`${patternTags.patternSimpleTag}`).test(tagSyntax)) {

            
            contentInHTML += tag.tagAndContent;

          }
            
          else if (new RegExp(`${patternTags.patternTagWithElements}`).test(tagSyntax)) {

            let options = tagSyntax.match(new RegExp('"([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"', 'g'));

            let contentListItem: string = "";
            for (let option of options) {
              contentListItem += `<li>${option.match(new RegExp('"([\&\t\'\n\>\<\+\$\@\%\#\*\!\?\)\(\_\:\/\.\,-ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]|\[|\])+"'))[0].replaceAll('"',"")}</li>`;
            }

            
            contentInHTML += tag.tagAndContent.replace("innerContent", contentListItem) + " ";
           
            
          }

          else {

            contentInHTML += tagSyntax;
          }
          
          
        }
        catch (e) {
          contentInHTML += tagSyntax;
        }
      }
    }

    this.renderContent = contentInHTML;
   
  }

  chooseElement(value: string) {

    let tag = (this.selectableTags.filter(tag => tag.syntaxUser.indexOf(value) === 0))[0];

    if (tag.modelUse.includes('imagen')) {

      let dialogImage: MatDialogRef<DialogImageComponent, any> = this.dialog.open(DialogImageComponent);
      
      dialogImage.afterClosed().subscribe((result: string) => {
        
        
        if (result !== null && result !== "") {
          let tagWithImage = tag.modelUse.replace("url de la imagen", result);

          this.formCreatePage.controls['contentEdit'].setValue(
            this.formCreatePage.value.contentEdit +
            `${this.formCreatePage.value.contentEdit === ""
              ? `${tagWithImage}`
              : `\n\n${tagWithImage}`
            }`
          );

        }
      });

      

      
      
    }
    else{
      this.formCreatePage.controls['contentEdit'].setValue(
        this.formCreatePage.value.contentEdit +
        `${this.formCreatePage.value.contentEdit === ""
          ? `${tag.modelUse}`
          : `\n\n${tag.modelUse}`
        }`
      );

    }

    

    
    this.formCreatePage.controls['tagsControl'].setValue('');
   

  }

  



  async createPage()  {


    this.formMetaDataPage.markAllAsTouched();
    this.formCreatePage.markAllAsTouched();
    const firstInvalidControl: HTMLInputElement = this.el.nativeElement.querySelector(
      "form .ng-invalid"
    );

    if (firstInvalidControl !== null) {
      window.scroll({
        top: this.getTopOffset(firstInvalidControl),
        left: 0,
        behavior: "smooth"
      });

      return;
    }

    let result: SweetAlertResult = await Swal.fire({
      title: '¿Confirmas la creación de la página?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })

    if (!result.isConfirmed) return;
    
    this.pageService.createPage({
      title_page: this.titlePageControl.value,
      contents_user: this.contentEdit.value,
      contents_html: this.renderContent,
      username: this.nameUserControl.value,
      type_of_page: this.typePageControl.value,
      category: this.categoryControl.value
    }).subscribe({
      next: (data: CreatePageResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 2500
        });
        this.titlePageControl.reset('');
        this.contentEdit.reset('');
        this.nameUserControl.reset('');
      },
      error: (err: CreatePageResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
          timer: 2500
        })
      }
    });

  }


  private getTopOffset(controlEl: HTMLInputElement): number {
    const labelOffset = 100;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  back() {
    this.router.navigate(['']);
  }


}
