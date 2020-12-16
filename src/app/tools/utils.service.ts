import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public equalsWithIgnoreCase(value1: string, value2: string) {
    return value1 && value1 && value1.toLowerCase() === value2.toLowerCase();
  }

}
