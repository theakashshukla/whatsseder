import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PlanDto {
  @IsString()
  @IsNotEmpty({ message: 'Email should not be empty' })
  planName: string;

  @IsString()
  @IsNotEmpty({ message: 'Plan Description should not be empty' })
  planDescription: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Plan Amount should not be empty' })
  planAmount: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Instance Count should not be empty' })
  instanceCount: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Discount Amount should not be empty' })
  discountedAmount: number;

  @IsString()
  @IsNotEmpty({ message: 'Feature should not be empty' })
  feature: string;

}