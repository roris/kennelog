import titleCase from 'title-case';

export class ApiError {
  message: string;
  name: string;
  code: number;

  constructor(error) {
    this.code = error.code;
    this.name = titleCase(error.name);
    this.message = error.message;
  }
}
