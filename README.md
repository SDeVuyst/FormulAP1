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
TODO aanvullen

```shell
yarn start:dev
```

## Testen

### databank schoon maken en herseeden
1) Databank resetten
    ```shell
    yarn prisma db push --force-reset
    ```
2) Seed databank
    ```shell
    yarn prisma db seed
    ```
