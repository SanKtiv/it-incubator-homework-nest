import {
    DeleteDateColumn,
    Entity,
    JoinColumn, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {AccountDataTable} from './account-data.table';
import {EmailConfirmationTable} from './email-сonfirmation.table';
import {PasswordRecoveryTable} from './password-recovery.table';
import {AnswersGameEntity} from "../../quiz/pair-game/domain/answers-game.entity";

@Entity('users')
export class UsersTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => AccountDataTable, (accountData) => accountData.user, {
        cascade: true,
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    accountData: AccountDataTable;

    @OneToOne(
        () => EmailConfirmationTable,
        (emailConfirmation) => emailConfirmation.user,
        {
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn()
    emailConfirmation: EmailConfirmationTable;

    @OneToOne(
        () => PasswordRecoveryTable,
        (passwordRecovery) => passwordRecovery.user,
        {
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn()
    passwordRecovery: PasswordRecoveryTable;

    @OneToMany(() => AnswersGameEntity,
        answersPairGames => answersPairGames.userId,
        {
            nullable: true,
            cascade: true,
            eager: true,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn({name: 'answersPairGames'})
    answersPairGames: AnswersGameEntity[];

    @DeleteDateColumn({type: 'timestamp with time zone', nullable: true})
    deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
