module.exports = {
    
    development: {
        client: 'postgresql',
        connection: {
            host: '127.0.0.1',
            user: 'postgres',
            password: '50v3rDB',
            database: 'portfolio',
            port: 5432
        }
    },

    production: {
        client: 'postgresql',
        connection: process.env.DATABASE_URL,
    }
};