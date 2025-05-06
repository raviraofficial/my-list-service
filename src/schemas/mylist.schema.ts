import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContentType } from 'src/modules/my-list/enums';

@Schema({ timestamps: true })
export class MyList extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true, enum: ContentType })
  contentType: ContentType;
}

export const MyListSchema = SchemaFactory.createForClass(MyList);

// Ensure no duplicate contentId per user
MyListSchema.index({ userId: 1, contentId: 1 }, { unique: true });
