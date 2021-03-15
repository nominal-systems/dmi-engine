import { IsNotEmpty } from 'class-validator';

export class ApiEvent {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  data: any;
}
