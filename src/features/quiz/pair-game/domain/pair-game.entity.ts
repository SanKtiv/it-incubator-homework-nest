import {Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersTable} from "../../../users/domain/users.table";

@Entity()
export class QuizPairGameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UsersTable)
    firstPlayer: UsersTable;

    @OneToOne(() => UsersTable)
    secondPlayer: UsersTable;
}