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

For at lokal-secret skal fungere må applikasjonen du skal nå (mottak, sak, iverksett..?) ha følgende i sin `azure-ad-app-lokal.yaml`:
```
spec:
  preAuthorizedApplications:
    ...
    - application: familie-prosessering-lokal
      cluster: dev-gcp
      namespace: teamfamilie
```

Appen krever en del environment variabler og legges til i .env fila i root på prosjektet.
secret kan hentes fra cluster med `kubectl -n teamfamilie get secret azuread-familie-prosessering-lokal -o json | jq '.data | map_values(@base64d)'`

Bruk override_scope for å sette scope manuelt for den applikasjonen du vil kjøre mot lokalt
```
    CLIENT_ID='<application_id from aad app>'
    CLIENT_SECRET='<KEY from aad app>'
    SESSION_SECRET='<any string of length 32>'
    OVERRIDE_SCOPE=api://.../.default
    ENV=local
```

For å bygge prodversjon kjør `yarn build`. Prodversjonen vil ikke kjøre lokalt med mindre det gjøres en del endringer i forbindelse med uthenting av environment variabler og URLer for uthenting av informasjon.

---

# Bygg og deploy
Appen bygges på github actions. Alle commits til feature brancher går automatisk til gcp-dev og commits til master går direkte til gcp-prod.
Hemmeligheter for appen ligger i etcd i kubernetes.

# Henvendelser

Ved spørsmål knyttet til koden eller prosjektet opprett en issue.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-familie.
