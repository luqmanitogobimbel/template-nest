import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

export class CustomErrorHandler {
  private error: any;
  private database: string; 

 // constructor(error: any);
  constructor(error: any, database?: string){
    this.error = error;
    if (database){
      this.database = database;
    }
  }

  sendPrismaAndGeneralError(){
    if (this.error instanceof PrismaClientInitializationError) {
      return {
        code: 500,
        message: `Prisma Client Initialization Error ${
          this.error.errorCode ? `code ${this.error.errorCode}` : ''
        }, Tidak bisa inisiasi koneksi dengan database ${this.database}`,
      };
    } else if (this.error instanceof PrismaClientKnownRequestError) {
      return {
        code: 500,
        message: `Prisma Client Known Request Error ${
          this.error.code ? `code ${this.error.code}` : ''
        }, Tidak bisa terhubung dengan database ${this.database}`,
      };
    }
    return this.sendGeneralError();
  }
  sendGeneralError(){
    return {
      code: this.error.code ? this.error.code : this.error.statusCode,
      message: this.error.message,
    };
  }
}