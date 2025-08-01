import { TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const handleCastError= (): TGenericErrorResponse =>{
    return{
        statusCode:404,
        message:"Invalid MongoDB ObjectID. Please provide a valid id"
    }
}