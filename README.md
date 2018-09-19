## Prerequisites  
- [nvm](https://github.com/creationix/nvm)  
- [NodeJS v8.9.0](https://nodejs.org/en/)  
- [yarn v1.3.2](https://www.npmjs.com/)  
- [PostgreSQL v9.5](https://www.postgresql.org)  
- [Redis v3.2](https://redis.io)  

## How to play  
- Make sure you already installed **nvm** by following the below construction  
  ```
  @refer https://github.com/creationix/nvm
  ```  
- Get the correct NodeJS version by running  
  ```
  nvm use  
  ```  
- Don't forget to activate **GraphicsMagic** and all dababases  
  ```
  - GraphicsMagic  
  - PostgreSQL  
  - Redis  
  ```  
- Install all dependencies  
  ```
  yarn install  
  ```
- Clone .env.example to .env and fill your prefered variables  
  ```
  cp .env.example .env  
  ```
- Start the server and enjoy your achievement   
  ```
  yarn run start
  ```

## List of commands
- Start main application  
  ```
  yarn start  
  ```
- Start job worker to crawling webhook's events  
  ```
  yarn job  
  ```
- Start cronjon worker to schedule broadcasts  
  ```
  yarn cron  
  ```

## Database job
- Migration  
  ```
  ./ace migration:run  
  ```
- Seed
  ```
  ./ace db:seed  
  ```

## Rules
- Make sure all branch's names and commits are valid  
- Use **yarn** to manage dependencies, **not by manual**
  ```
  yarn -h  
  ```
