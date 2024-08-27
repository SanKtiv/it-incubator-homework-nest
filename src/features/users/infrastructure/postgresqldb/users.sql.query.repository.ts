import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../../domain/users.schema';
import { Types } from 'mongoose';
import { UsersQuery } from '../../api/models/input/users.query.dto';
import {
    filterByLoginAndEmail,
    loginAndEmailToRegExp,
} from '../utils.repositories';
import {
    infoCurrentUserDto,
    InfoCurrentUserDto,
} from '../../../auth/api/models/output/info-current-user.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {UsersTable} from "../../domain/users.table";

@Injectable()
export class UsersSqlQueryRepository {
    constructor(
        @InjectDataSource() protected dataSource: DataSource,
    ) {}

    // async findById(id: string): Promise<UserDocument | null> {
    //     return this.UserModel.findById(id);
    // }
    //
    async infoCurrentUser(id: string): Promise<InfoCurrentUserDto> {
        const userDocument = await this.dataSource
            .getRepository(UsersTable)
            .findOneBy({id: id});
        return infoCurrentUserDto(userDocument!);
    }
    //
    // async loginIsExist(login: string): Promise<number> {
    //     return this.UserModel.countDocuments({ 'accountData.login': login });
    // }
    //
    // async emailIsExist(email: string): Promise<number> {
    //     return this.UserModel.countDocuments({ 'accountData.email': email });
    // }
    //
    // async findUserByLoginOrEmail(
    //     loginOrEmail: string,
    // ): Promise<UserDocument | null> {
    //     const filter = filterByLoginAndEmail(loginOrEmail, loginOrEmail);
    //     return this.UserModel.findOne(filter);
    // }
    //
    async countDocument(query: UsersQuery): Promise<number> {
        const term = loginAndEmailToRegExp(
            query.searchLoginTerm,
            query.searchEmailTerm,
        );

        const filter = filterByLoginAndEmail(term.login, term.email);

        return this.dataSource
            .getRepository(UsersTable)
            .count(filter);
    }

    async findPaging(query: UsersQuery): Promise<UsersTable[]> {
        const term = loginAndEmailToRegExp(
            query.searchLoginTerm,
            query.searchEmailTerm,
        );

        const filter = filterByLoginAndEmail(term.login, term.email);

        //const sortBy = `accountData.${query.sortBy}`; for mongo

        return this.dataSource
            .getRepository(UsersTable)
            .createQueryBuilder("user")
            .where(filter)
            .orderBy(query.sortBy, query.sortDirection)
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .take(+query.pageSize)
            .getMany();
    }
}
