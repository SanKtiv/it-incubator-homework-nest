import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountDataTable } from './account-data.table';
import { EmailConfirmationTable } from './email-сonfirmation.table';
import { PasswordRecoveryTable } from './password-recovery.table';

@Entity('users')
export class UsersTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AccountDataTable, (accountData) => accountData.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  accountData: AccountDataTable;

  @OneToOne(
    () => EmailConfirmationTable,
    (emailConfirmation) => emailConfirmation.user,
    { cascade: ['insert', 'update'] },
  )
  @JoinColumn()
  emailConfirmation: EmailConfirmationTable;

  @OneToOne(
    () => PasswordRecoveryTable,
    (passwordRecovery) => passwordRecovery.user,
    { cascade: ['insert', 'update'] },
  )
  @JoinColumn()
  passwordRecovery: PasswordRecoveryTable;
}
