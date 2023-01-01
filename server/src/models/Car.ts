import mongoose, { HydratedDocument } from 'mongoose';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'LPG' | 'CNG';
export type Transmission = 'Automatic' | 'Manual';
export type CarStatus = 'In Stock' | 'In Transit' | 'Sold' | 'On Order';

export interface ICar {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: Transmission;
  engine: string;
  inspected: boolean;
  color: string;
  description: string;
  image: string;
  images: string[];
  featured: boolean;
  status: CarStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CarDoc = HydratedDocument<ICar>;

const carSchema = new mongoose.Schema<ICar>(
  {
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    fuel: {
      type: String,
      required: true,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'],
    },
    transmission: {
      type: String,
      required: true,
      enum: ['Automatic', 'Manual'],
    },
    engine: { type: String, required: true },
    inspected: { type: Boolean, default: true },
    color: { type: String, default: 'White' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['In Stock', 'In Transit', 'Sold', 'On Order'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

carSchema.index({ brand: 'text', model: 'text', engine: 'text' });

export const Car = mongoose.model<ICar>('Car', carSchema);
