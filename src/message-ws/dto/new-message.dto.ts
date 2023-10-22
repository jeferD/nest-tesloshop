import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class NewMessageDto{
    @IsString() 
    @MinLength(1)
    message: String;
}