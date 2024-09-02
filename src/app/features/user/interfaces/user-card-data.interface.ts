import {FormControl} from "@angular/forms";
import {User} from "./user.interface";

export interface UserCardData {
  id: string,
  formControl: FormControl<User>
}
