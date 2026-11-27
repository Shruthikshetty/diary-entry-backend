# Diary Entry Backend

A REST API for user accounts and personal diary entries. It uses Hono, MongoDB, and JWT authentication.

## Requirements

- [Bun](https://bun.sh/)
- MongoDB

## Setup

Install dependencies:

```sh
bun install
```

Set the environment variables in a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/diary-entry
JWT_SECRET=replace-with-a-long-random-secret
RESENT_KEY=re_your_resend_api_key
RESEND_SENDER=StillDiary <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:3001
```

Start the development server:

```sh
bun run dev
```

The API runs at `http://localhost:3000`.

When deploying to Cloud Run, set `FRONTEND_URL` to the deployed frontend's origin, not the API URL (for example, `https://your-app.example.com`). CORS allows that origin and `http://localhost:3001` / `http://127.0.0.1:3001`. Redeploy after changing the environment variable.

## API

| Method                 | Route                        | Description                                    |
| ---------------------- | ---------------------------- | ---------------------------------------------- |
| `GET`                  | `/`                          | Basic server response                          |
| `POST`                 | `/api/signup`                | Create an account with an email and password   |
| `POST`                 | `/api/login`                 | Log in with email and password                 |
| `POST`                 | `/api/forgot-password`       | Send a password reset link by email            |
| `GET`                  | `/api/diary`                 | List your diary entries                        |
| `POST`                 | `/api/diary`                 | Create a diary entry                           |
| `GET`                  | `/api/diary/:id`             | Get one diary entry                            |
| `PUT`                  | `/api/diary/:id`             | Update a diary entry                           |
| `DELETE`               | `/api/diary/:id`             | Delete a diary entry                           |
| `GET`, `PUT`, `DELETE` | `/api/user`                  | Get, update, or delete your account            |

Diary and user routes require authentication. Send the JWT returned by `/api/login` in the `Authorization: Bearer <token>` header. Login also sets an `auth_token` cookie.

Signup and login expect JSON bodies containing `email` and `password`. Signup may also include an optional `name`. Email addresses are trimmed and stored in lowercase; email addresses must be unique.

Password reset also expects the email in the JSON body:

```json
{ "email": "you@example.com" }
```

Before deploying this email requirement to a database with existing users, populate a valid, unique email for every account. Then remove the existing unique index on `name` (commonly named `name_1`) if duplicate names should be allowed. Do not enable the unique email index until existing records have been backfilled and duplicate emails resolved.
