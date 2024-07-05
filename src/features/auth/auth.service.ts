import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService extends UsersService {}
