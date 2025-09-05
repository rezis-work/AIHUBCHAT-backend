import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChatsService } from "./chats.service";

@Controller("api/chat")
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @Get("count")
  @UseGuards(JwtAuthGuard)
  async countChats() {
    return this.chatsService.countChats();
  }
}
