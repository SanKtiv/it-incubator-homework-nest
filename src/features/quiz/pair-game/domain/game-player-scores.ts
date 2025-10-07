import {Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {PairGamePlayersEntity} from "./pair-game-players.entity";
import {PairGamesEntity} from "./pair-games.entity";

@Entity('game-player-scores')
export class GamePlayerScoresEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => PairGamesEntity)
    @JoinColumn()
    pairGame: PairGamesEntity;

    @ManyToOne(() => PairGamePlayersEntity, (player) => player.gameScore)
    @JoinColumn()
    playerScore: PairGamePlayersEntity
}