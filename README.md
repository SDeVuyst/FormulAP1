# Examenopdracht Web Services

- Student: Silas De Vuyst
- Studentennummer: 202399688
- E-mailadres: <mailto:silas.devuyst@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)


## Back-end

## Opstarten

Begin met een .env bestand aan te maken in de root van het project. Dit kan met:
```shell
cp .env.example .env
```

Open de .env file en pas de volgende variabelen aan:
  - USERNAME
  - PASSWORD
  - DB_NAME
  
Pas ook eventueel <b>localhost:3306</b> aan zodat de databank correct saat ingesteld.

Schakel corepack in
```shell
corepack enable
```

Installeer de dependencies
```shell
yarn
```

Hierna volg je de stappen voor Development of Productie

### Development
Hierna laden we de databank in via:
```shell
yarn migrate:dev
```
Dan seeden we de databank:
```shell
yarn prisma db seed
```
Hierna kunnen we het project opstarten via:

```shell
yarn start:dev
```

### Productie
Run migraties
```shell
yarn prisma migrate deploy
```

Build project
```shell
yarn build
```

Start productie server
```shell
node build/src/index.js
```

## Testen

Zet allereest de environment op testing door een kopie te maken van .env:
```shell
cp .env .env.test
```

Zet in het nieuw aangemaakte .env.test bestand:
> NODE_ENV=development

Migreer de databank:
```shell
yarn migrate:test
```

Hierna kan er getest worden met:
```shell
yarn test
```
Of door:
```shell
yarn test:coverage
```
> De coverage report is te vinden onder '\_\_tests\_\_/coverage/lcov-report/index.html'


### databank schoon maken en herseeden
1) Databank resetten
    ```shell
    yarn prisma db push --force-reset
    ```
2) Seed databank
    ```shell
    yarn prisma db seed
    ```
