export class CustomError extends Error {
    statusCode: number; // Define the statusCode property

    constructor(message: any, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
