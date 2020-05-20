# env-manager
Managing env variables in javascript application with ease.

## Why one more tool for the managing of the environment variables?

As developers we have to manage environment variables in different environments.

And environment is not only determined by the value of NODE_ENV variable. It's determined, where you run your code:

- local machine.
- CI tool to run tests, to publish docker images.
- Deployment on some cloud.



We know, that we shouldn't commit .env file. So, there're a lot (huge) amount of ways to manage environment variables in different variables:

### On local machine 
We used to have .env file. 

### On CI 

We used to use SETTINGS to set up env variables 

### On clouds 

There's also special section to manage all this stuff or we also have to add .env file there manually.

So, in different environments we manage environment variables separately. And it adds big layer of complexity and source of issues.

We created this tool to simplify process of managing of environment variables to make it joyable and pretty fast.

## How to use

In the root of your project you should create env.js file. 

This file should create object with variables for absolutely all environments:

```typescript
const config = {
  development: {...},
  test: {...},
  ci: {...},
  production: {...},
}
```

You should include env.js into .gitignore file, cause you should hide your credentials.

Before adding and commiting changes you should run

```bash
@j.u.p.iter/env-manager encrypt
```

You'll be able to find newly created file into the root directory: env.enc.js (enc part stands for `encrypted`). This file should be added and commited.

In the entry point file of your project you should write:

```typescript
import { envManager } from '@j.u.p.iter/env-manager';

envManager()
```

What it does:

- decrypts file env.enc.js
- read config according to running environment
- add config to process.env

You should point out NODE_ENV in script, that you use to run your project. This way manager understands, what config it should extract from env.enc.js and merge into process.env.
