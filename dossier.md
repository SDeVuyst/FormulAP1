# Dossier

- Student: Silas De Vuyst
- Studentennummer: 202399688
- E-mailadres: <mailto:silas.devuyst@student.hogent.be>
- Demo: <DEMO_LINK_HIER> #TODO
- GitHub-repository: <https://github.com/HOGENT-frontendweb/frontendweb-2425-SDeVuyst>
- Web Services:
  - Online versie: <LINK_ONLINE_VERSIE_HIER> #TODO

## Logingegevens

### Lokaal
TODO
- Gebruikersnaam/e-mailadres:
- Wachtwoord:

### Online
TODO
- Gebruikersnaam/e-mailadres:
- Wachtwoord:

> Vul eventueel aan met extra accounts voor administrators of andere rollen.

## Projectbeschrijving

Deze api (Formulapi) gaat over de wereld van Formula 1. Hierin kunnen we de drivers terugvinden (deze worden in dit project gezien als users voor authenticatie doeleinden), circuits, races, resultaten van races, teams & auto's. Dit project werd volledig in typescript geschreven. Er wordt gebruik gemaakt van prisma als ORM en Koa voor routing en request handling.
![erd](images/erd.svg)


## API calls

### Driver (User)
- `GET /api/drivers`: alle drivers ophalen (auth en admin vereist)
- `GET /api/drivers/:id`: driver met een bepaald id ophalen (auth vereist)
- `GET /api/drivers/:id/results`: De resultaten van een driver met een bepaald id ophalen (auth vereist)
- `POST /api/drivers`: een nieuwe driver aanmaken (auth vereist)
- `PUT /api/drivers/:id`: een driver aanpassen (auth vereist)
- `DELETE /api/drivers/:id`: een driver met een bepaald id verwijderen (auth vereist)

### Circuit
- `GET /api/circuits`: alle circuits ophalen (geen vereisten)
- `GET /api/circuits/:id`: circuit met een bepaald id ophalen (geen vereisten)
- `GET /api/circuits/:id/races`: races op een circuit met een bepaald id ophalen (geen vereisten)
- `POST /api/circuits`: een nieuw circuit aanmaken (auth en admin vereist)
- `PUT /api/circuits/:id`: een circuit aanpassen (auth en admin vereist)
- `DELETE /api/circuits/:id`: een circuit met een bepaald id verwijderen (auth en admin vereist)

### Race
- `GET /api/races`: alle races ophalen (geen vereisten)
- `GET /api/races/:id`: races met een bepaald id ophalen (geen vereisten)
- `GET /api/races/:id/results`: De resultaten van een race met een bepaald id ophalen (auth vereisten)
- `POST /api/races`: een nieuwe race aanmaken (auth en admin vereist)
- `PUT /api/races/:id`: een race aanpassen (auth en admin vereist)
- `DELETE /api/races/:id`: een race met een bepaald id verwijderen (auth en admin vereist)
  
### Result
- `GET /api/results`: alle results ophalen (auth vereisten)
- `GET /api/results/:id`: result met een bepaald id ophalen (auth vereisten)
- `POST /api/results`: een nieuwe result aanmaken (admin vereist)
- `PUT /api/results/:id`: een result aanpassen (admin vereist)
- `DELETE /api/results/:id`: een result met een bepaald id verwijderen (admin vereist)

### Team
- `GET /api/teams`: alle results ophalen (auth vereisten)
- `GET /api/teams/:id`: result met een bepaald id ophalen (auth vereisten)
- `GET /api/teams/:id/drivers`: drivers van een bepaals team ophalen (admin vereist)
- `GET /api/teams/:id/cars`: cars van een bepaals team ophalen (auth vereist)
- `POST /api/teams`: een nieuwe result aanmaken (admin vereist)
- `PUT /api/teams/:id`: een result aanpassen (admin vereist)
- `DELETE /api/teams/:id`: een result met een bepaald id verwijderen (admin vereist)

### Car
- `GET /api/cars`: alle results ophalen (auth vereisten)
- `GET /api/cars/:id`: result met een bepaald id ophalen (auth vereisten)
- `GET /api/cars/:id/results`: results van een bepaals team ophalen (auth vereist)
- `POST /api/cars`: een nieuwe result aanmaken (admin vereist)
- `PUT /api/cars/:id`: een result aanpassen (admin vereist)
- `DELETE /api/cars/:id`: een result met een bepaald id verwijderen (admin vereist)
  
## Behaalde minimumvereisten

### Web Services

#### Datalaag

- [X] voldoende complex en correct (meer dan één tabel (naast de user tabel), tabellen bevatten meerdere kolommen, 2 een-op-veel of veel-op-veel relaties)
- [X] één module beheert de connectie + connectie wordt gesloten bij sluiten server
- [X] heeft migraties - indien van toepassing
- [X] heeft seeds

#### Repositorylaag

- [X] definieert één repository per entiteit - indien van toepassing
- [X] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
- [X] er worden kindrelaties opgevraagd (m.b.v. JOINs) - indien van toepassing

#### Servicelaag met een zekere complexiteit

- [X] bevat alle domeinlogica
- [X] er wordt gerelateerde data uit meerdere tabellen opgevraagd
- [X] bevat geen services voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [X] bevat geen SQL-queries of databank-gerelateerde code

#### REST-laag

- [X] meerdere routes met invoervalidatie
- [X] meerdere entiteiten met alle CRUD-operaties
- [X] degelijke foutboodschappen
- [X] volgt de conventies van een RESTful API
- [X] bevat geen domeinlogica
- [X] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bv. tussentabellen)
- [X] degelijke autorisatie/authenticatie op alle routes

#### Algemeen

- [X] er is een minimum aan logging en configuratie voorzien
- [X] een aantal niet-triviale én werkende integratietesten (min. 1 entiteit in REST-laag >= 90% coverage, naast de user testen)
- [X] node_modules, .env, productiecredentials... werden niet gepushed op GitHub
- [X] minstens één extra technologie die we niet gezien hebben in de les
- [X] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
- [X] de applicatie start zonder problemen op gebruikmakend van de instructies in de README
- [ ] de API draait online #TODO
- [X] duidelijke en volledige README.md
- [X] er werden voldoende (kleine) commits gemaakt
- [X] volledig en tijdig ingediend dossier

## Projectstructuur

### Web Services

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns...)?

## Extra technologie

1) zxcvbn wordt gebruikt als validator bovenop Joi om de sterkte van wachtwoorden te valideren.
2) Er wordt [apiDoc](https://apidocjs.com/) gebruikt om de documentatie van deze api te genereren.

### Web Services

Ik heb gekozen om [apiDoc](https://www.npmjs.com/package/apidoc) te gebruiken in plaats van Swagger. Met apiDoc kan je makkelijk een documentatie pagina genereren via:
```shell
npx apidoc -i src/ -o docs/
```
Aangezien ik dit veel moest uitvoeren heb ik hiervan een script gemaakt in package.json, nu kan er nog gemakkelijker documentatie worden aangemaakt via:
```shell
yarn docs
```
De documentatie van de API routes worden beschreven in de rest-laag, door middel van specifieke comments. De documentatie bekijken kan via [/docs/index.html](docs/index.html)


## Gekende bugs

### Web Services

Geen gekende bugs.

## Reflectie

> Wat vond je van dit project? Wat heb je geleerd? Wat zou je anders doen? Wat vond je goed? Wat vond je minder goed?
> Wat zou je aanpassen aan de cursus? Wat zou je behouden? Wat zou je toevoegen?
TODO
