import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name Should not be empty' })
  @IsString()
  name: string;

  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
