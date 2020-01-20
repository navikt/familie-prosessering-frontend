# familie-prosessering

Frontend applikasjon for monitorering og håndtering av prosesstasks for familieområdet

Applikasjonen kan snakke med flere "backends" med konfigurasjon du finner i serviceConfig.ts.
Ting du må gjøre for å få frontend til å snakke med din backend:
1. Legg til config for din app i serviceConfig.ts
2. Legg til appen som preauthorized i aad-iac repoet.
3. Legg til scope for azure i familie secret for hvert cluster (dev og prod gcp)
4. Implementer interfacene som kreves i backenden. Se familie-ks-mottak for inspirasjon.
5. Backend må ha en ingress slik at denne appen kan kalle backend fra gcp til fss.

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Starte dev-server `yarn start:dev`
* Åpne `http://localhost:8000` i nettleseren din

Appen krever en del environment variabler og legges til i .env fila i root på prosjektet.  
```
    PROSESSERING_CLIENT_ID='<application_id from aad app>'
    PROSESSERING_CLIENT_SECRET='<KEY from aad app>'
    PROSESSERING_SESSION_SECRET='<any string of length 32>'

    APP_SCOPE: api://APP_CLIENT_ID/.default // Hver tjeneste appen kaller må legges til på denne måten
    
    ENV=local
```

For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---

# Bygg og deploy
Appen bygges på github actions. Alle commits til feature brancher går automatisk til gcp-dev og commits til master går direkte til gcp-prod.
Hemmeligheter for appen ligger i etcd i kubernetes.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Henning Håkonsen, `henning.hakonsen@nav.no`

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.