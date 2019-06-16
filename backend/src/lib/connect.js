import { env } from './env'
import { logger } from './logger'
import mongoose from 'mongoose'

export default () => {
  
  const connect = () => {
    mongoose
      .connect(
        env.DATABASE_URL,
        { useNewUrlParser: true }
      )
      .then(() => {
        return logger.debug(`Successfully connected to ${env.DATABASE_URL}`);
      })
      .catch(error => {
        logger.debug(`Error connecting to database:`, error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};



