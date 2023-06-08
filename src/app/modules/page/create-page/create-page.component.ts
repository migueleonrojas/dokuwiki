import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import tags from '../../../../assets/tags.json';
import { Tag } from 'src/app/models/tag';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  @ViewChild('textArea') textAreaElement: ElementRef<HTMLTextAreaElement>;
  formMetaDataPage: FormGroup;
  titlePageControl = new FormControl('', [Validators.required]);
  nameUserControl = new FormControl('', [Validators.required]);

  formCreatePage: FormGroup;


  renderContent: String;
  selectableTags: Tag[] = tags;
  filteredTags: Observable<Tag[]>;

  
  constructor(
    private location: Location,
    private renderer: Renderer2
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
   
  }
  
  private _filter(value: string): Tag[]{
    const filterValue = value.toLowerCase();
    return this.selectableTags.filter(tag => tag.nameTag.toLowerCase().includes(filterValue));

  } 


  formBuilds() {

    this.formMetaDataPage = new FormGroup({
      titlePageControl: this.titlePageControl,
      nameUserControl: this.nameUserControl
    });

    this.formCreatePage = new FormGroup({
      tagsControl: new FormControl(''),
      contentEdit: new FormControl(''),
    });

  }

  changeContenrRendered(contentEditValue: string) {

    let patternTags = {
      patternSimpleTag: '\/[0-9a-z ]{1,}\/',
      patternTagNoAttributes: '[0-9a-z ]{1,} = "[0-9a-z ]{0,}"',
      patternTagWithAttributes: '[a-z ]{0,} = \/"[0-9a-z ]{0,}"\/( \/[a-z]{0,}="[?:/.0-9a-zA-Z-_ ]{0,}"\/){1,}',
      patternTagWithElements: '[a-z ]{0,} >(( |-)\/[a-z]{1,}="[a-z0-9 ]{1,}"\/){1,}'
    }

    let allTagsSyntax: RegExpMatchArray | null = contentEditValue.match(new RegExp(`(${patternTags.patternTagWithAttributes}|${patternTags.patternTagNoAttributes}|${patternTags.patternSimpleTag}|${patternTags.patternTagWithElements})`, 'g'));
     
    let contentInHTML:string = "";

    if (allTagsSyntax) {
      for (let tagSyntax of allTagsSyntax) { 
        
        let contentValue = tagSyntax.match(new RegExp('"[/:.0-9a-zA-Z-_ ]{0,}"', 'g'));
        
        let tag = this.selectableTags.filter(tag => new RegExp(tag.syntaxUser).test(tagSyntax))[0];
        
        try {
          
          if (new RegExp(`${patternTags.patternTagNoAttributes}`).test(tagSyntax)) {
            
            contentInHTML += tag.tagAndContent.replace("content", contentValue[0].replaceAll("\"", "")) + " ";

          }
          else if (new RegExp(`${patternTags.patternTagWithAttributes}`).test(tagSyntax)) { 

            contentInHTML += tag.tagAndContent.replace("content", contentValue[0].replaceAll('"',"")).replace("value", `${contentValue[1]}`) + " ";

          }

          else if (new RegExp(`${patternTags.patternSimpleTag}`).test(tagSyntax)) {

            contentInHTML += tag.tagAndContent;

          }
            
          else if (new RegExp(`${patternTags.patternTagWithElements}`).test(tagSyntax)) {

            let options = tagSyntax.match(new RegExp('"[0-9a-z ]{1,}"', 'g'));

            let contentListItem: string = "";
            for (let option of options) {
              contentListItem += `<li>${option.match(new RegExp('"[0-9a-z ]+"'))[0].replaceAll('"',"")}</li>`;
            }

            
            contentInHTML += tag.tagAndContent.replace("content", contentListItem) + " ";
            
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

    this.formCreatePage.controls['contentEdit'].setValue(
      this.formCreatePage.value.contentEdit +
      `${this.formCreatePage.value.contentEdit === ""
        ? `${tag.modelUse}`
        : `\n\n${tag.modelUse}`
      }`
    );
    
    this.formCreatePage.controls['tagsControl'].setValue('');
  }

  back() {
    this.location.back();
  }


}
