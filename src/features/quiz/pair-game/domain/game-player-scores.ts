import {Entity, Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PairGamePlayersEntity} from "./pair-game-players.entity";
import {PairGamesEntity} from "./pair-games.entity";

@Entity('game-player-scores')
export class GamePlayerScoresEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    gameId: string;

    @ManyToOne(() => PairGamePlayersEntity, (player) => player.gameScore)
    @JoinColumn()
    playerScore: PairGamePlayersEntity;

    @Column({type: 'smallint', default: 0})
    score: number;
}