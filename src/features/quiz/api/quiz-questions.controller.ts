import {Controller, Delete, Get, Post, Put} from "@nestjs/common";

@Controller('sa/quiz/questions')
export class QuizQuestionsController {
    constructor() {
    }

    @Post()
    async createQuestions() {

    }

    @Get()
    async getQuestions() {

    }

    @Put(':id')
    async updateQuestionsById() {

    }

    @Put(':id/publish')
    async publishQuestionsById() {

    }

    @Delete(':id')
    async deleteQuestionsById() {

    }
}