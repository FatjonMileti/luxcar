import mongoose from 'mongoose';
import { config } from './config';
import { connectMongo } from './mongo';
import { Car } from './models/Car';

const cars = [
  {
    brand: 'Hyundai', model: 'Sonata', year: 2021, price: 16500, mileage: 58000,
    fuel: 'Petrol', transmission: 'Automatic', engine: '2.0L', inspected: true,
    color: 'White', featured: true, status: 'In Stock',
    description: 'Hyundai Sonata 2021 imported from South Korea, fully inspected, no accidents.',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
  },
  {
    brand: 'Kia', model: 'Sorento', year: 2020, price: 21900, mileage: 72000,
    fuel: 'Diesel', transmission: 'Automatic', engine: '2.2L', inspected: true,
    color: 'Black', featured: true, status: 'In Stock',
    description: 'Kia Sorento 7-seater, ideal for families. Engine + gearbox warranty.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
  },
  {
    brand: 'Hyundai', model: 'Tucson', year: 2022, price: 23500, mileage: 35000,
    fuel: 'Hybrid', transmission: 'Automatic', engine: '1.6 T-GDI', inspected: true,
    color: 'Grey', featured: true, status: 'In Stock',
    description: 'Hyundai Tucson Hybrid 2022, low consumption, latest technology.',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
  },
  {
    brand: 'Kia', model: 'K5', year: 2021, price: 17200, mileage: 61000,
    fuel: 'Petrol', transmission: 'Automatic', engine: '2.0L', inspected: true,
    color: 'Red', featured: true, status: 'In Stock',
    description: 'Sporty and elegant Kia K5, inspected in Korea before RO-RO shipment.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
  {
    brand: 'Genesis', model: 'G70', year: 2020, price: 24800, mileage: 54000,
    fuel: 'Petrol', transmission: 'Automatic', engine: '2.0T', inspected: true,
    color: 'Blue', featured: false, status: 'In Stock',
    description: 'Premium Genesis G70, leather, navigation, 360 sensors.',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80',
  },
  {
    brand: 'Hyundai', model: 'Santa Fe', year: 2019, price: 18900, mileage: 89000,
    fuel: 'Diesel', transmission: 'Automatic', engine: '2.2L', inspected: false,
    color: 'White', featured: false, status: 'In Transit',
    description: 'Hyundai Santa Fe on the RO-RO route, arrives in 35 days. Reserve now.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
  },
  {
    brand: 'Kia', model: 'Sportage', year: 2022, price: 22900, mileage: 28000,
    fuel: 'Petrol', transmission: 'Automatic', engine: '1.6T', inspected: true,
    color: 'Black', featured: true, status: 'In Stock',
    description: 'Almost new 2022 Kia Sportage, only 28,000 km.',
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
  },
  {
    brand: 'Tesla', model: 'Model 3', year: 2021, price: 26500, mileage: 45000,
    fuel: 'Electric', transmission: 'Automatic', engine: 'Electric', inspected: true,
    color: 'White', featured: true, status: 'In Stock',
    description: 'Tesla Model 3 Long Range from Korea, battery in excellent condition.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
  },
];

async function seed(): Promise<void> {
  const uri: string = config.mongoUri;
  await connectMongo(uri);
  console.log('Connected:', uri);
  await Car.deleteMany({});
  await Car.insertMany(cars);
  console.log(`Seeded ${cars.length} cars`);
  await mongoose.disconnect();
}

seed().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
