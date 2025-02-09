import {
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccountDataTable } from './account-data.table';
import { EmailConfirmationTable } from './email-сonfirmation.table';
import { PasswordRecoveryTable } from './password-recovery.table';

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

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date; // Поле для хранения даты удаления для softRemove, softDelete
}
