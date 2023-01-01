import mongoose, { Document } from 'mongoose';

export type InquiryStatus = 'New' | 'Read' | 'Closed';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  message: string;
  car: mongoose.Types.ObjectId | null;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new mongoose.Schema<IInquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    message: { type: String, required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: null },
    status: { type: String, enum: ['New', 'Read', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);
