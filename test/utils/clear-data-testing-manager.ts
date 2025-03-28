import {INestApplication} from "@nestjs/common";
import request from "supertest";

export class ClearDataTestingManager {
    constructor(protected readonly app: INestApplication) {
    }

    async clearDB() {
        return request(this.app.getHttpServer())
            .delete('/testing/all-data')
            .expect(204)
    }
}