kubectl config use-context dev-gcp

function get_secrets() {
  local repo=$1
  kubectl -n teamfamilie get secret ${repo} -o json | jq '.data | map_values(@base64d)'
}

PROSESSERING_LOKAL_SECRETS=$(get_secrets azuread-familie-prosessering-lokal)

PROSESSERING_CLIENT_ID=$(echo "$PROSESSERING_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_ID')
PROSESSERING_CLIENT_SECRET=$(echo "$PROSESSERING_LOKAL_SECRETS" | jq -r '.AZURE_APP_CLIENT_SECRET')

# Generate random 32 character strings for the cookie and session keys
SESSION_SECRET=$(openssl rand -hex 16)

if [ -z "$PROSESSERING_CLIENT_ID" ]
then
      echo "Klarte ikke å hente miljøvariabler. Er du pålogget Naisdevice og google?"
      return 1
fi

# Write the variables into the .env file
cat << EOF > .env
# Denne filen er generert automatisk ved å kjøre \`hent-og-lagre-miljøvariabler.sh\`

AZURE_APP_CLIENT_ID=$PROSESSERING_CLIENT_ID
AZURE_APP_CLIENT_SECRET=$PROSESSERING_CLIENT_SECRET
SESSION_SECRET=$SESSION_SECRET

# Lokalt
#ENV=local
#OVERRIDE_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak-lokal/.default

# Lokalt mot preprod
ENV=lokalt-mot-preprod
OVERRIDE_SCOPE=api://dev-gcp.teamfamilie.familie-ef-sak/.default

HOST=familie-prosessering
NAIS_NAMESPACE=teamfamilie
EOF