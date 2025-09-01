import { forwardRef, Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesResolver } from "./messages.resolver";
import { ChatsModule } from "../chats.module";

@Module({
  imports: [forwardRef(() => ChatsModule)],
  providers: [MessagesResolver, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
