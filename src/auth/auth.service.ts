import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import type { User } from "src/users/entities/user.entity";
import { TokenPayload } from "./token-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

@Injectable()
export class AuthService {
  static verifyWs(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
  ) {
    throw new Error("Method not implemented.");
  }
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.getOrThrow<number>("JWT_EXPIRATION")
    );

    const tokenPayload: TokenPayload = {
      ...user,
      _id: user._id.toHexString(),
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie("Authentication", token, {
      httpOnly: true,
      expires,
    });

    return { success: true };
  }

  verifyWs(request: Request): TokenPayload {
    const cookies: string[] | undefined = request.headers.cookie?.split("; ");
    const authCookie = cookies?.find((cookie) =>
      cookie.includes("Authentication")
    );
    const jwt = authCookie?.split("Authentication=")[1];
    return this.jwtService.verify(jwt!);
  }

  logout(response: Response) {
    response.cookie("Authentication", "", {
      httpOnly: true,
      expires: new Date(),
    });

    return { success: true };
  }
}
