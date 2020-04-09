import {Pipe, PipeTransform} from '@angular/core';
import {Decision} from "../../../business/models/referencial/decision";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(args: Decision[], value: any): any {
    if (!args || !value) {
      return [];
    }
    return args.filter(item => item.decisionTypeId === Number(value));
  }

}
