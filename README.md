
# OpenEvidence Toy Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setup

### Prerequisites
You will need the following environment variable to run the project:

- **`OPENAI_API_KEY`**: Your OpenAI API key for generating AI responses.

### Setup

This project uses **SQLite** to persist ad performance data.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

3. **Migrate the Database**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Seed test data**:
   These are generated data to showcase the functionality of the ad render and engagement logging
   ```bash
   npx prisma db seed
   ```

### Running the Development Server

Once the environment variables are set and the database is ready, you can start the development server:
```bash
OPENAI_API_KEY=your_openai_api_key_here npm run dev
```
This will start the server at [http://localhost:3000](http://localhost:3000).


### Testing the App

Asking questions with keyword triggers would cause any matched ads to show up on the bottom of the page. I opted to not replace the loading spinner and allow the ad to persist after loading for more engagement time and easier testing.

Search for a few questions with keyword triggers, see the `prisma/seed.ts` file to see what keywords would trigger what kind of ads, alternatively you can run
```bash
npx prisma studio
```
to directly inspect the database.

After some engagement data has been collected, you can navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to for a basic performance report page by company.


### Reset the DB

Useful in development if you change any data models and want to start fresh

```bash
rm prisma/dev.db
```

```bash
npx prisma migrate reset
```
