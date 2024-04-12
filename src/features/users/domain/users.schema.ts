import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import {UsersInputDto} from "../api/models/input/users.input.dto";

@Schema()
class PasswordRecoveryType {
    recoveryCode: string;
    expirationDate: Date;
}

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

@Schema()
class EmailConfirmation {
    @Prop({ required: true })
    confirmationCode: string;

    @Prop({ required: true })
    expirationDate: Date;

    @Prop({ required: true })
    isConfirmed: boolean;
}

@Schema()
export class User {
    @Prop({ type: AccountData, required: true })
    accountData: AccountData;

    @Prop({ type: EmailConfirmation, required: true })
    emailConfirmation: EmailConfirmation;

    @Prop({ type: PasswordRecoveryType })
    passwordRecovery?: PasswordRecoveryType;

    static createUser(dto: UsersInputDto, passwordHash: string, UserModel: Model<User>) {
        const userModel = new UserModel(dto);
        userModel.accountData.passwordHash = passwordHash;
        userModel.accountData.createdAt = new Date().toISOString();
        return userModel;
    }
}

export type UserDocument = HydratedDocument<User>;

export type UsersModelType = Model<UserDocument> & BlogsStaticMethodsType;

export const UsersSchema = SchemaFactory.createForClass(User);

export type BlogsStaticMethodsType = {
    createBlog: (
        dto: UsersInputDto,
        BlogModel: Model<UserDocument>,
    ) => UserDocument;
};

UsersSchema.statics = {
    createUser: User.createUser,
};
