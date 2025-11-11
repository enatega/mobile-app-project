
export enum BACKEND_URL{

    LOCAL = "http://192.168.18.88:3000",
    LOCAL_HOST = "http://localhost:3000",
    PRODUCTION = "https://api-nestjs-enatega.up.railway.app"

}

const isDev = false;

export const BASE_URL = isDev ? BACKEND_URL.LOCAL_HOST : BACKEND_URL.PRODUCTION;