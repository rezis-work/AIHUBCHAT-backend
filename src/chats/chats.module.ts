import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsResolver } from "./chats.resolver";
import { ChatsRepository } from "./chats.repository";
import { MessagesModule } from "./messages/messages.module";
import { forwardRef } from "@nestjs/common";
import { ChatDocument, ChatDocumentSchema } from "./entities/chat.document";
import { ChatsController } from "./chats.controller";
import { DatabaseModule } from "src/common/database/database.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: ChatDocument.name, schema: ChatDocumentSchema },
    ]),
    forwardRef(() => MessagesModule),
    UsersModule,
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository],
  exports: [ChatsRepository, ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
