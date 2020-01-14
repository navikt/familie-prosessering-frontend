# familie-prosessering

Frontend applikasjon for monitorering og håndtering av mottak for familieområdet

Applikasjonen kan snakke med flere "backends" med konfigurasjon du finner i serviceConfig.ts.
Ting du må gjøre for å få frontend til å snakke med din backend:
1. Legg til config for din app i serviceConfig.ts
2. Legg til appen som preauthorized i aad-iac repoet.
3. Legg til scope for azure i vault for familie-prosessering
4. Implementer interfacene som kreves i backenden. Se familie-ks-mottak for inspirasjon.

# Kom i gang med utvikling

* Installere avhengigheter `yarn`
* Starte dev-server `yarn start:dev`
* Åpne `http://localhost:8000` i nettleseren din

Appen krever en del environment variabler og legges til i .env fila i root på prosjektet.  
```
    PROSESSERING_CLIENT_ID='<application_id from aad app>'
    PROSESSERING_CLIENT_SECRET='<KEY from aad app>'
    FAMILIE_SESSION_SECRET='<any string of length 32>'
    
    ENV=local
    APP_VERSION=0.0.1
```

For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---

# Bygg og deploy
Appen bygges hos circleci, og gir beskjed til nais deploy om å deployere appen i fss området. Alle commits til feature brancher går med godkjennelse til preprod og commits til master går direkte til preprod. Med godkjennelse går commits til master til produksjon.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes til:

* Henning Håkonsen, `henning.hakonsen@nav.no`

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.