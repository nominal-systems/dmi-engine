import { Injectable } from '@nestjs/common';
import { convert } from 'xmlbuilder2';

@Injectable()
export class XmlService {
  convertXmlToObject(xml: string) {
    return convert(xml, { format: 'object' });
  }

  convertObjectToXml(obj: any) {
    return convert(obj, { format: 'xml' });
  }
}
