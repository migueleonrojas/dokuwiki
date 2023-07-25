export interface Page {
  id_page?:           string;
  title_page:         string;
  contents_user:      string;
  contents_html:      string;
  username:           string;
  creation_date?:     Date;
  modification_date?: Date;

  type_of_page:       string;
  category?:           string;
  
}