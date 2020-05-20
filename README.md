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

