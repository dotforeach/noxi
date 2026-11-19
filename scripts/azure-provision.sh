#!/usr/bin/env bash
# Crea lo que falta sobre la infraestructura existente (RG Noxi, ACR noxiacr48213, entorno noxi-env):
# Postgres Flexible Server (acceso público + SSL) y las Container Apps backend/frontend.
# Uso: ./scripts/azure-provision.sh   (lee JWT_SECRET de .env)
set -euo pipefail
cd "$(dirname "$0")/.."

RG=${RG:-Noxi}
LOCATION=${LOCATION:-northcentralus}
ACR=${ACR:-noxiacr48213}
ENV_NAME=${ENV_NAME:-noxi-env}
PULL_IDENTITY=${PULL_IDENTITY:-noxi-acr-pull}   # identidad con AcrPull sobre el ACR
PG=${PG:-noxi-pg}
DB_NAME=noxi
DB_USER=noxiadmin
JWT_SECRET=${JWT_SECRET:-$(grep -E '^JWT_SECRET=' .env | cut -d= -f2-)}
DB_PASS=${DB_PASS:-$(openssl rand -hex 24)}

az extension add --name containerapp --upgrade -y
az provider register -n Microsoft.App -n Microsoft.DBforPostgreSQL --wait

IDENTITY_ID=$(az identity show -g "$RG" -n "$PULL_IDENTITY" --query id -o tsv)

# --public-access 0.0.0.0 = solo servicios de Azure (incluye Container Apps). SSL es obligatorio por defecto.
# Si el servidor ya existe, exporta DB_PASS con su contraseña para reanudar.
if ! az postgres flexible-server show -g "$RG" -n "$PG" >/dev/null 2>&1; then
  az postgres flexible-server create -g "$RG" -n "$PG" -l "$LOCATION" \
    --admin-user "$DB_USER" --admin-password "$DB_PASS" \
    --tier Burstable --sku-name Standard_B1ms --storage-size 32 --version 16 \
    --public-access 0.0.0.0 --yes >/dev/null
fi
az postgres flexible-server db create -g "$RG" -s "$PG" -n "$DB_NAME" >/dev/null
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$PG.postgres.database.azure.com:5432/$DB_NAME?sslmode=require"

# Imagen placeholder; el pipeline la reemplaza por las reales.
HELLO=mcr.microsoft.com/k8se/quickstart:latest
az containerapp create -g "$RG" -n noxi-backend --environment "$ENV_NAME" --image "$HELLO" \
  --target-port 3000 --ingress external --min-replicas 1 --max-replicas 2 \
  --user-assigned "$IDENTITY_ID" --registry-server "$ACR.azurecr.io" --registry-identity "$IDENTITY_ID" \
  --secrets db-url="$DATABASE_URL" jwt="$JWT_SECRET" \
  --env-vars PORT=3000 DATABASE_URL=secretref:db-url JWT_SECRET=secretref:jwt JWT_EXPIRES_IN=1h
BACKEND_FQDN=$(az containerapp show -g "$RG" -n noxi-backend --query properties.configuration.ingress.fqdn -o tsv)

az containerapp create -g "$RG" -n noxi-frontend --environment "$ENV_NAME" --image "$HELLO" \
  --target-port 80 --ingress external --min-replicas 1 --max-replicas 2 \
  --user-assigned "$IDENTITY_ID" --registry-server "$ACR.azurecr.io" --registry-identity "$IDENTITY_ID" \
  --env-vars "BACKEND_URL=https://$BACKEND_FQDN"

echo "Frontend: https://$(az containerapp show -g "$RG" -n noxi-frontend --query properties.configuration.ingress.fqdn -o tsv)"
