import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './schema/auth.shcema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  bcrypt: any;
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(res, req, registerDto: RegisterDto) {
    try {
      const { name, email, password } = registerDto;

      const user = await this.UserModel.findOne({ email });
      if (user) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.UserModel({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(res, req, loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.UserModel.findOne({
        email,
      });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid password');
      }
      const token = this.jwtService.sign({ id: user._id });

      res
        .status(200)
        .json({ message: 'User logged in successfully', token: token });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllUsers(res) {
    try {
      const users = await this.UserModel.find().exec();

      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }

      res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
