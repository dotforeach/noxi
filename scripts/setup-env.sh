#!/usr/bin/env sh
# Genera un .env local con secretos aleatorios a partir de .env.example.
# No sobrescribe un .env existente. El .env está en .gitignore: nunca se sube al repositorio.
set -eu
cd "$(dirname "$0")/.."

if [ -f .env ]; then
  echo ".env ya existe; no se modifica." >&2
  exit 0
fi

rand() { head -c 48 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c "$1"; }

POSTGRES_PASSWORD="$(rand 24)"
JWT_SECRET="$(rand 48)"

while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in
    POSTGRES_USER=) echo "POSTGRES_USER=noxi" ;;
    POSTGRES_PASSWORD=) echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" ;;
    JWT_SECRET=) echo "JWT_SECRET=$JWT_SECRET" ;;
    *) echo "$line" ;;
  esac
done < .env.example > .env

chmod 600 .env
echo ".env generado con secretos aleatorios."
