module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  entities: ['dist/**/**.model{.ts,.js}'],
  migrationsRun: true,
  migrations: [
    'dist/libs/database/src/migrations/**/*{.ts,.js}'
  ],
  cli: {
    migrationsDir: 'dist/libs/database/src/migrations'
  }
}