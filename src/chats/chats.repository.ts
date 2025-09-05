import { Global, Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "src/common/database/abstract.repository";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "./entities/chat.entity";
import { ChatDocument } from "./entities/chat.document";

@Global()
@Injectable()
export class ChatsRepository extends AbstractRepository<ChatDocument> {
  protected readonly logger = new Logger(ChatsRepository.name);
  constructor(@InjectModel(Chat.name) chatModel: Model<ChatDocument>) {
    super(chatModel);
  }
}
