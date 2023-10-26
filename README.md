# PB Cambridge Backend

### To start the server, clone the repository to your local device

```bash
git clone https://github.com/PB-cambridge/PB-backend.git

cd PB-backend
npm install

mkdir .env
```

### Create the following environment variable

```env
PORT="50"
BASE_URL="127.0.0.1:50"
DATABASE_URL="file:./db.sqlite"
DEV_ENV="development"
CORS_ORIGIN="*"
```

### Then run

```bash
npm run db:sync
npm run db:seed
npm start
```
