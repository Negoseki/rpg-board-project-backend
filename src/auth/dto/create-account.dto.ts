import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Matches(new RegExp('^[a-z0-9_-]{3,16}$'), {
    message: 'Only numbers, letters and (_-)',
  })
  @MaxLength(16)
  @MinLength(3)
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
