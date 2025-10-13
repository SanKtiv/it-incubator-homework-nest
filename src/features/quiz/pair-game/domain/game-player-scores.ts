import {Entity, Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PairGamePlayersEntity} from "./pair-game-players.entity";
import {PairGamesEntity} from "./pair-games.entity";

@Entity('game-player-scores')
export class GamePlayerScoresEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    gameId: string;

    @Column({type: 'smallint', default: 0})
    score: number;

    @ManyToOne(() => PairGamePlayersEntity, (player) => player.gameScore)
    @JoinColumn()
    playerScore: PairGamePlayersEntity;
}