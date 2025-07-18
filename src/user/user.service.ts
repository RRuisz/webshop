import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {Role, User} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {UserCreateDto, UserUpdateDto} from "./dto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {AuthLoginDto} from "../auth/dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly config: ConfigService) {
    }

    async createUser(data: UserCreateDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        if (!data.userName) {
            data.userName = data.firstName.slice(0, 1) + data.lastName;
        }
        data.dateOfBirth = new Date(data.dateOfBirth);
        const user = await this.prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                userName: data.userName,
                email: data.email,
                password: hashedPassword,
                date_of_birth: data.dateOfBirth,
                role: data.role ?? Role.CUSTOMER,
            }
        })

        return this.signJwtToken(user.id, user.email)
    }

    async updateUser(userDto: UserUpdateDto, id: number) {
        const data: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'password' | 'date_of_birth' | 'merchantId' | 'userName' | 'role' | 'updatedAt'>> = {}

        if (userDto.firstName) data.firstName = userDto.firstName;
        if (userDto.lastName) data.lastName = userDto.lastName;
        if (userDto.email) data.email = userDto.email;
        if (userDto.password) data.password = await bcrypt.hash(userDto.password, 10);
        if (userDto.dateOfBirth) data.date_of_birth = userDto.dateOfBirth;
        if (userDto.merchantId) data.merchantId = userDto.merchantId;
        if (userDto.userName) data.userName = userDto.userName;
        if (userDto.role) data.role = userDto.role;

        if (Object.keys(data).length === 0) return;

        data.updatedAt = new Date();

        const user = await this.prisma.user.update({
            where: {id: id},
            data: data
        })

        return this.serializeUser(user)
    }

    protected serializeUser(user: User) {
        const {password, createdAt, updatedAt, merchantId, id, role, ...result} = user;
        return result;
    }

    async loginUser(userDto: AuthLoginDto) {
        const user = await this.verifyUser(userDto)

        return this.signJwtToken(user.id, user.email)
    }

    private async verifyUser(data: {email: string, password: string}) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) throw new NotFoundException('User not found')

        const verify = await bcrypt.compare(data.password, user.password)
        if (verify) {
            return user;
        } else {
            throw new NotFoundException('User not found')
        }
    }

    private async signJwtToken(userId: number, userEmail: string) {
        const payload = {
            sub: userId,
            email: userEmail
        };

        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1h',
                secret: this.config.get('JWT_SECRET')
            })
        }
    }
}
