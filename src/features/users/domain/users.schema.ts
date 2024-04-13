import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import {UsersInputDto} from "../api/models/input/users.input.dto";

@Schema()
class PasswordRecovery {
    recoveryCode: string;
    expirationDate: Date;
}

const PasswordRecoverySchema = SchemaFactory.createForClass(PasswordRecovery)

@Schema()
class AccountData {
    @Prop({ required: true })
    login: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    createdAt: string;

    @Prop({ required: true })
    passwordHash: string;
}

const AccountDataSchema = SchemaFactory.createForClass(AccountData)

@Schema()
class EmailConfirmation {
    @Prop({ required: true })
    confirmationCode: string;

    @Prop({ required: true })
    expirationDate: Date;

    @Prop({ required: true })
    isConfirmed: boolean;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation)

@Schema()
export class User {
    @Prop({ type: AccountDataSchema, required: true, _id: false})
    accountData;

    @Prop({ type: EmailConfirmationSchema, required: true, _id: false })
    emailConfirmation;

    @Prop({ type: PasswordRecoverySchema, _id: false })
    passwordRecovery?;

    static createUser(
        dto: UsersInputDto,
        passwordHash: string,
        confirmationCode: string,
        expirationDate: Date,
        UserModel: Model<User>
    ) {
        const userModel = new UserModel();
        const accountData: AccountData = {
            login: dto.login,
            email: dto.email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        }
        const emailConfirmation: EmailConfirmation = {
            confirmationCode: confirmationCode,
            expirationDate: expirationDate,
            isConfirmed: false
        }
        //Object.assign(userModel.accountData, {...dto, passwordHash:passwordHash, createdAt:new Date().toISOString()})
        // console.log('userModel', userModel)
        // console.log('dto.login', dto.login)
        //console.log('userModel.accountData.login', userModel.accountData.login)
        userModel.accountData = accountData
        userModel.emailConfirmation = emailConfirmation
        // userModel.accountData.email = dto.email
        // userModel.accountData.passwordHash = passwordHash;
        // userModel.accountData.createdAt = new Date().toISOString();
        // userModel.emailConfirmation.confirmationCode = confirmationCode;
        // userModel.emailConfirmation.expirationDate = expirationDate;
        // userModel.emailConfirmation.isConfirmed = false;
        console.log('userModel.accountData', userModel.accountData)
        return userModel;
    }
}

export type UserDocument = HydratedDocument<User>;

export type UsersModelType = Model<UserDocument> & UsersStaticMethodsType;

export const UsersSchema = SchemaFactory.createForClass(User);

export type UsersStaticMethodsType = {
    createUser: (
        dto: UsersInputDto,
        passwordHash: string,
        confirmationCode: string,
        expirationDate: Date,
        UserModel: Model<UserDocument>,
    ) => UserDocument;
};

UsersSchema.statics = {
    createUser: User.createUser,
};
