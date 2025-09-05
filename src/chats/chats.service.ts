import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateChatInput } from "./dto/create-chat.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { ChatsRepository } from "./chats.repository";
import { PipelineStage, Types } from "mongoose";
import { PaginationArgs } from "src/common/dto/pagination-args.dto";

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) {}
  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
      name: createChatInput.name || "",
    });
  }

  async findMany(
    prePipelineStages: PipelineStage[] = [],
    paginationArgs?: PaginationArgs
  ) {
    const chats = await this.chatsRepository.model.aggregate([
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            $cond: [
              "$messages",
              { $arrayElemAt: ["$messages", -1] },
              { createdAt: new Date() },
            ],
          },
        },
      },
      {
        $sort: {
          "latestMessage.createdAt": -1,
        },
      },
      {
        $skip: paginationArgs?.skip ?? 0,
      },
      {
        $limit: paginationArgs?.limit ?? 10,
      },
      {
        $unset: "messages",
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.userId",
          foreignField: "_id",
          as: "latestMessage.user",
        },
      },
    ]);
    chats.forEach((chat) => {
      if (!chat.latestMessage._id) {
        delete chat.latestMessage;
        return;
      }

      const u = Array.isArray(chat.latestMessage.user)
        ? chat.latestMessage.user[0]
        : chat.latestMessage.user;

      chat.latestMessage.user = u ?? null;

      if (chat.latestMessage.user?._id) {
        chat.latestMessage.user._id = chat.latestMessage.user._id.toString();
      }

      chat.latestMessage.chatId = chat._id.toString?.() ?? chat._id;
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return chats;
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      {
        $match: {
          chatId: new Types.ObjectId(_id.toString()),
        },
      },
    ]);
    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ${_id}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return chats[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async userCheckFilter(userId: string) {
    return {
      $or: [
        { userId },
        {
          userIds: {
            $in: [userId],
          },
        },
        { isPrivate: false },
      ],
    };
  }

  async countChats() {
    return this.chatsRepository.model.countDocuments({});
  }
}
