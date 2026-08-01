import mongoose from 'mongoose';
import { retry } from 'node-retry-kit';

// Connecting is side-effect-free, so every failure is safe to retry.
// This covers boot ordering (API starting before MongoDB is reachable).
export async function connectMongo(uri: string): Promise<void> {
  await retry(() => mongoose.connect(uri), {
    retries: 5,
    backoff: 'exponential',
    delay: 500,
    maxDelay: 8000,
    jitter: 'equal',
    onRetry: (err, ctx) =>
      console.log(
        `Mongo connect attempt ${ctx.attempt} failed, retrying in ${ctx.delay}ms:`,
        err instanceof Error ? err.message : err
      ),
  });
}
