import { Injectable, Logger } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { AbstractRepository } from "src/common/database/abstract.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
