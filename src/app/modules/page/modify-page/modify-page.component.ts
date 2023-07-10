import { Component, Directive, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import tags from 'src/assets/tags.json';
import { Tag } from 'src/app/models/tag.model';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { PageService } from 'src/app/services/page/page.service';
import { CreatePageResponse } from 'src/app/models/createPageResponse.model';
import Swal, { SweetAlertResult } from 'sweetalert2'
import { SharingService } from 'src/app/core/services/sharing.service';
import { Page } from 'src/app/models/page.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogImageComponent } from 'src/app/components/dialog-image/dialog-image.component';

@Component({
  selector: 'app-modify-page',
  templateUrl: './modify-page.component.html',
  styleUrls: ['./modify-page.component.css'],
})
export class ModifyPageComponent implements OnInit {
  @ViewChild('textArea') textAreaElement: ElementRef<HTMLTextAreaElement>;
  formMetaDataPage: FormGroup;
  titlePageControl = new FormControl('', [Validators.required]);
  nameUserControl = new FormControl('', [Validators.required]);
  typePageControl = new FormControl({value: '', disabled: true}, [Validators.required]);
  isSolvedControl = new FormControl(false);
  types_of_pages: {name:string, value:string}[] = [
    {name: 'Documentación', value: 'documentación'},
    {name: 'Incidente',     value: 'incidente'},
  ];

  formCreatePage: FormGroup;
  tagsControl = new FormControl('');
  contentEdit = new FormControl('',[Validators.required]);

  allTagsSyntax: RegExpMatchArray | null;
  renderContent: string;
  selectableTags: Tag[] = tags;
  filteredTags: Observable<Tag[]>;
  page: Page;
  
  constructor(
    private location: Location,
    private el: ElementRef,
    private pageService: PageService,
    private sharingService: SharingService,
    private router: Router,
    public dialog: MatDialog
    
  ) {
    this.formBuilds();
  }


  ngOnInit(): void {
   
    this.filteredTags = this.formCreatePage.controls['tagsControl'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === "string" ? value : value.nameTag),
      map(nameTag => nameTag ? this._filter(nameTag): this.selectableTags.slice())
    );
    
    this.formCreatePage.controls['contentEdit'].valueChanges.subscribe((data => this.changeContenrRendered(data)));

    this.sharingService.sharingPageObservable.subscribe((page: Page) => {

      this.page = page;

      this.nameUserControl.setValue(page.username);
      this.titlePageControl.setValue(page.title_page);
      this.contentEdit.setValue(page.contents_user);
      this.typePageControl.setValue(page.type_of_page);
      this.isSolvedControl.setValue(page.is_solved ? true : false) 

    });
   
  }
  
  private _filter(value: string): Tag[]{
    const filterValue = value.toLowerCase();
    return this.selectableTags.filter(tag => tag.nameTag.toLowerCase().includes(filterValue));
  } 


  formBuilds() {

    this.formMetaDataPage = new FormGroup({
      titlePageControl: this.titlePageControl,
      nameUserControl: this.nameUserControl,
      typePageControl: this.typePageControl,
      isSolvedControl: this.isSolvedControl,
    });

    this.formCreatePage = new FormGroup({
      tagsControl: this.tagsControl,
      contentEdit: this.contentEdit,
    });

  }

  changeContenrRendered(contentEditValue: string) {

    let patternTags = {
      patternSimpleTag: '\/[ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]{1,}\/',
      patternTagNoAttributes: '[0-9a-zA-Z ]{1,} = "[\'\>\<\+\$\@\%\#\*\!\?\)\(\-\_\:\/\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]{0,}"',
      patternTagWithAttributes: '[a-zA-Z ]{0,} = \/"[\'\>\<\+\$\@\%\#\*\!\?\)\(\-\_\:\/\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]{0,}"\/( \/[a-zA-Z]{0,}="[\)\(\-\_\:\/\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]{0,}"\/){1,}',
      patternTagWithElements: '[a-zA-Z ]{0,} >(( |-)\/[a-zA-Z]{1,}="[\'\>\<\+\$\@\%\#\*\!\?\)\(\-\_\:\/\.\,a-zA-Z0-9ñáéíóúÁÉÍÓÚ ]{1,}"\/){1,}'
    }

    this.allTagsSyntax = contentEditValue.match(new RegExp(`(${patternTags.patternTagWithAttributes}|${patternTags.patternTagNoAttributes}|${patternTags.patternSimpleTag}|${patternTags.patternTagWithElements})`, 'g'));
     
    let contentInHTML:string = "";

    if (this.allTagsSyntax) {
      for (let tagSyntax of this.allTagsSyntax) { 
        
        let contentValue = tagSyntax.match(new RegExp('"[\'\>\<\+\$\@\%\#\*\!\?\)\(/:\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z-_ ]{0,}"', 'g'));
        
        let tag = this.selectableTags.filter(tag => new RegExp(tag.syntaxUser).test(tagSyntax))[0];
        
        try {
          
          if (new RegExp(`${patternTags.patternTagNoAttributes}`).test(tagSyntax)) {
            
            contentInHTML += tag.tagAndContent.replace("innerContent", contentValue[0].replaceAll("\"", "")) + " "; 

          }
          else if (new RegExp(`${patternTags.patternTagWithAttributes}`).test(tagSyntax)) { 

            

            contentInHTML += tag.tagAndContent.replace("innerContent", contentValue[0].replaceAll('"',"")).replace("value", `${contentValue[1]}`) + " ";

          }

          else if (new RegExp(`${patternTags.patternSimpleTag}`).test(tagSyntax)) {

            contentInHTML += tag.tagAndContent;

          }
            
          else if (new RegExp(`${patternTags.patternTagWithElements}`).test(tagSyntax)) {

            let options = tagSyntax.match(new RegExp('"[\'\>\<\+\$\@\%\#\*\!\?\)\(\-\_\:\/\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]{1,}"', 'g'));


            let contentListItem: string = "";
            for (let option of options) {
              contentListItem += `<li>${option.match(new RegExp('"[\'\>\<\+\$\@\%\#\*\!\?\)\(\-\_\:\/\.\,ñáéíóúÁÉÍÓÚ0-9a-zA-Z ]+"'))[0].replaceAll('"',"")}</li>`;
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


  async modifyPage()  {

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
      title: '¿Confirmas la modificación de la página?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    })

    if (!result.isConfirmed) return;
    
    this.pageService.modifyPage({
      id_page: this.page.id_page,
      title_page: this.page.title_page,
      contents_user: this.contentEdit.value,
      contents_html: this.renderContent,
      username: this.page.username,
      creation_date: this.page.creation_date,
      is_solved: this.isSolvedControl.value ? '1' : '0',
      type_of_page: this.page.type_of_page
    }).subscribe({
      next: (data: CreatePageResponse) => {
        this.sharingService.sharingPageObservableData = data.page;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: data.message,
          showConfirmButton: false,
          timer: 2500
        });
      },
      error: (err: any) => {
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

  goTo(path: string) {
    
    this.router.navigate([`/${path}`]);

  }


  back() {
    this.location.back();
  }



}
