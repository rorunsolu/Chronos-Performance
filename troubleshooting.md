Problem: 500: INTERNAL_SERVER_ERROR
Fix: Changed "type": "module" to "type": "commonjs" in backend/package.json

Problem: Error 404 Vercel deployment
Fix: Create api folder in backend/src and move index.ts (formally server.ts) there. Vercel cannot deploy node without an api folder. Update paths in backend/package.json, backend/tsconfig.json, and backend/vercel.json accordingly.
Link: https://stackoverflow.com/questions/72584745/having-problem-deploying-express-server-on-vercel-404-page-not-found

Problem: Vercel not detecting vercel.json
Fix: Move vercel.json to backend folder (same level as package.json and tsconfig.json)
