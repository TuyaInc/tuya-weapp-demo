const url = ''

let config = {
    env: {
        development: {
            serviceHost: url
        },
        production: {
            serviceHost: url
        }
    },
    serviceHost: url
}

const isDevelopment = process.env.NODE_ENV === 'development';

config.serviceHost = isDevelopment ? config.env.development.serviceHost : config.env.production.serviceHost;

export default config;