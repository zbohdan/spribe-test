import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from '@angular/core';
import {User} from "@features/user/interfaces/user.interface";
import {CheckUserResponseData} from "@shared/interfaces/check-user-response-data.interface";
import {SubmitFormResponseData} from "@shared/interfaces/submit-form-response-data.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient);
  private checkUserNameUrl = '/checkUsername';
  private submitFormUrl = '/submitForm';

  checkUsername(username: string): Observable<CheckUserResponseData> {
    return this.httpClient.post<CheckUserResponseData>(this.checkUserNameUrl, {username});
  }

  submit(users: User[]): Observable<SubmitFormResponseData> {
    return this.httpClient.post<SubmitFormResponseData>(this.submitFormUrl, {users});
  }
}
