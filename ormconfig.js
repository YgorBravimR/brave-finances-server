module.exports = [
  {
    name: 'default',
    type: 'mongodb',
    url: process.env.MONGODB_URL,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
    useUnifiedTopology: true,
    entities: [`./${process.env.NODE_ENV === 'dev' ? 'src' : 'dist'}/app/models/schemas/*.${process.env.NODE_ENV === 'dev' ? 'ts' : 'js'}`],
  },
  // {
  //   name: 'postgres',
  //   type: 'postgres',
  //   host: process.env.POSTGRES_HOST,
  //   port: process.env.POSTGRES_PORT,
  //   username: process.env.POSTGRES_USERNAME,
  //   password: process.env.POSTGRES_PASSWORD,
  //   database: process.env.POSTGRES_DATABASE,
  //   entities: [`./${process.env.NODE_ENV === 'dev' ? 'src' : 'dist'}/app/models/*.${process.env.NODE_ENV === 'dev' ? 'ts' : 'js'}`],
  //   migrations: [`./${process.env.NODE_ENV === 'dev' ? 'src' : 'dist'}/database/migrations/*.${process.env.NODE_ENV === 'dev' ? 'ts' : 'js'}`],
  //   cli: {
  //       migrationsDir: './src/database/migrations',
  //   },
  // }
]