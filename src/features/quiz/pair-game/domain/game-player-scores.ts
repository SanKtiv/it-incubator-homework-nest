import {Entity, Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PlayersEntity} from "./players.entity";
import {PairGamesEntity} from "./pair-games.entity";

@Entity('game-player-scores')
export class GamePlayerScoresEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'uuid'})
    gameId: string;

    @Column({type: 'smallint', default: 0})
    score: number;

    @ManyToOne(
        () => PlayersEntity,
        (player) => player.gameScore
    )
    @JoinColumn()
    playerScore: PlayersEntity;
}