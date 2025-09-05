import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsResolver } from "./chats.resolver";
import { ChatsRepository } from "./chats.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat } from "./entities/chat.entity";
import { MessagesModule } from "./messages/messages.module";
import { forwardRef } from "@nestjs/common";
import { ChatDocumentSchema } from "./entities/chat.document";
import { ChatsController } from "./chats.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatDocumentSchema },
    ]),
    forwardRef(() => MessagesModule),
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository, ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
