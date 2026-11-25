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

## API

| Method                 | Route                        | Description                                    |
| ---------------------- | ---------------------------- | ---------------------------------------------- |
| `GET`                  | `/`                          | Basic server response                          |
| `POST`                 | `/api/signup`                | Create an account                              |
| `POST`                 | `/api/login`                 | Log in and receive a JWT                       |
| `POST`                 | `/api/forgot-password/:name` | Send a password reset link to the user's email |
| `GET`                  | `/api/diary`                 | List your diary entries                        |
| `POST`                 | `/api/diary`                 | Create a diary entry                           |
| `GET`                  | `/api/diary/:id`             | Get one diary entry                            |
| `PUT`                  | `/api/diary/:id`             | Update a diary entry                           |
| `DELETE`               | `/api/diary/:id`             | Delete a diary entry                           |
| `GET`, `PUT`, `DELETE` | `/api/user`                  | Get, update, or delete your account            |

Diary and user routes require authentication. Send the JWT returned by `/api/login` in the `Authorization: Bearer <token>` header. Login also sets an `auth_token` cookie.
