import {IsDate, IsEmail, IsInt, IsOptional, IsString} from "class-validator"
import {Role} from "@prisma/client";

export class UserCreateDto {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsString()
    @IsOptional()
    userName: string

    @IsEmail()
    email: string

    @IsString()
    password: string

    @IsInt()
    @IsOptional()
    merchantId: number|null

    @IsOptional()
    role: Role|null

    @IsDate()
    dateOfBirth: Date
}

export class UserUpdateDto {
    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string

    @IsString()
    @IsOptional()
    userName: string

    @IsEmail()
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    password: string

    @IsInt()
    @IsOptional()
    merchantId: number|null

    @IsOptional()
    role: Role|null

    @IsDate()
    @IsOptional()
    dateOfBirth: Date
}