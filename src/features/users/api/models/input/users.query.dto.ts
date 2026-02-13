import {
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import {Type} from 'class-transformer';
import {ToUpperCase} from '../../../../../infrastructure/decorators/transform/toUpperCase.decorator';
import {ApiProperty} from "@nestjs/swagger";

enum sortDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class UsersQuery {
    @ApiProperty({
        type: String,
        description: 'Search by login',
        default: null
    })
    @IsOptional()
    @IsString()
    searchLoginTerm: string | null = null;

    @ApiProperty({
        type: String,
        description: 'Search by email',
        default: null
    })
    @IsOptional()
    @IsString()
    searchEmailTerm: string | null = null;

    @ApiProperty({
        type: String,
        description: 'Sort users by',
        default: 'createdAt'
    })
    @IsOptional()
    @IsString()
    sortBy: string = 'createdAt';

    @ApiProperty({
        type: String,
        description: 'Sort ASC or DESC users',
        default: sortDirection.DESC
    })
    @IsOptional()
    @ToUpperCase()
    @IsString()
        // sortDirection: 'ASC' | 'DESC' = 'DESC';
    sortDirection: sortDirection = sortDirection.DESC;

    @ApiProperty({
        type: Number,
        description: 'Page number',
        default: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    pageNumber: number = 1;

    @ApiProperty({
        type: Number,
        description: 'Page size ',
        default: 10
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    pageSize: number = 10;

    constructor(query: Partial<UsersQuery> = {}) {
        Object.assign(this, query);
    }
}
