cd ./mortar-app-frontend
npm install
npm run build

cd ../
docker compose down
docker compose up --build -d
