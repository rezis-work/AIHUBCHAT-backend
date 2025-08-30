import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";
import { DbMigrationService } from "./db-migration.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DbMigrationService],
})
export class DatabaseModule {
  static forFeature(model: ModelDefinition[]) {
    return MongooseModule.forFeature(model);
  }
}
