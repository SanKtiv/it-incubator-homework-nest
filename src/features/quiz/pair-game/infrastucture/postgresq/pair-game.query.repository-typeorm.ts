import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizPairGameEntity} from "../../domain/pair-game.entity";
import {Repository} from "typeorm";

@Injectable()
export class PairGameQueryRepositoryTypeOrm {
    constructor(@InjectRepository(QuizPairGameEntity) protected repository: Repository<QuizPairGameEntity>) {
    }

    async getById(id: string) {
        return this.repository
            .createQueryBuilder('pg')
            .select('pg.*')
            .getRawOne()
    }
}