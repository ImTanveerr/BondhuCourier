import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleCastError= (err: any): TGenericErrorResponse =>{
    return{
        statusCode:404,
        message:"Invalid MongoDB ObjectID. Please provide a valid id"
    }
}