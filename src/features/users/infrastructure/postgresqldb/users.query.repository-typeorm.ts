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
import { InjectDataSource } from '@nestjs/typeorm';
import { Brackets, DataSource } from 'typeorm';
import { UsersTable } from '../../domain/users.table';
import {
    UsersPagingDto,
    usersPagingDto,
} from '../../api/models/output/users.output.dto';

@Injectable()
export class UsersQueryRepositoryOrm {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    private get repository() {
        return this.dataSource.getRepository(UsersTable)
    }
    // async findById(id: string): Promise<UserDocument | null> {
    //     return this.UserModel.findById(id);
    // }
    //
    async infoCurrentUser(id: string): Promise<InfoCurrentUserDto> {
        const user = await this.repository.findOneBy({ id: id });

        return infoCurrentUserDto(user!);
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

        return this.dataSource.getRepository(UsersTable).count(filter);
    }

    async findPaging(query: UsersQuery): Promise<UsersPagingDto> {
        const loginTerm = query.searchLoginTerm;
        const emailTerm = query.searchEmailTerm;

        const users = this.repository.createQueryBuilder('user');

        if (loginTerm || emailTerm) {
            const filter = 'user.login ~* :login OR user.email ~* :email';
            const paramFilter = { login: loginTerm, email: emailTerm };

            users.where(filter, paramFilter);
        }

        const totalUsers = await users.getCount();

        const usersPaging = await users
            .orderBy(`user.${query.sortBy}`, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .take(query.pageSize)
            .getMany();

        return usersPagingDto(totalUsers, query, usersPaging);
    }
}
