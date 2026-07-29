set dotenv-load

default:
  @just --choose

setup:
  # --legacy-peer-deps for pouchdb-find
  npm install --legacy-peer-deps

serve:
  NODE_OPTIONS=--openssl-legacy-provider npm run serve

deploy:
  @rsync -avz --progress --delete --verbose ./dist/ "$USERNAME@$HOSTNAME:$WEBROOT/"

