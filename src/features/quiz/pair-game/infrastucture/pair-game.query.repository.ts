import {Injectable} from "@nestjs/common";

@Injectable()
export class PairGameQueryRepository {
    constructor(protected repository: PairGameQueryRepository) {
    }

    async getById(id: string) {
        const pairGame = await this.repository.getById(id)

        return pairGame
    }
}