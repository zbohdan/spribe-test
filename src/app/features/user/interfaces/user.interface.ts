import {UserFormField} from "../enums/user-form-field.enum";

export interface User {
  [UserFormField.Country]: string;
  [UserFormField.Username]: string;
  [UserFormField.Birthday]: string;
}
