import { Connection } from 'mongoose';
import {DataSource} from "typeorm";
import {BlogsTable} from "../../src/features/blogs/domain/blog.entity";

export const deleteAllData = async (databaseConnection: Connection) => {
  await databaseConnection.collection('users').deleteMany({});
  await databaseConnection.collection('some').deleteMany({});
};

export const deleteAllDataSQL = async (databaseConnection: DataSource) => {
  await databaseConnection.getRepository(BlogsTable).clear()
}