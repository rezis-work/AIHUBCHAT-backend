import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UsersRepository } from "./users.repository";
import { S3Service } from "src/common/s3/s3.service";
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from "./users.constants";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service
  ) {}
  async create(createUserInput: CreateUserInput) {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password),
      });
    } catch {
      throw new ConflictException("User already exists");
    }
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await this.hashPassword(
        updateUserInput.password
      );
    }

    return this.usersRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
        },
      }
    );
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async uploadImage(file: Buffer, userId: string) {
    this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: `${userId}.${USERS_IMAGE_FILE_EXTENSION}`,
      file,
    });
  }
}
