import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest<{ user: User }>().user;
  } else if (context.getType<GqlContextType>() === "graphql") {
    const ctx = GqlExecutionContext.create(context);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return ctx.getContext().req.user;
  } else {
    throw new Error("Invalid context type");
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context)
);
