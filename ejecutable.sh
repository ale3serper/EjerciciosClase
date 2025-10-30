#!/bin/bash

# ===============================================
# 🚀 Script para inicializar un proyecto Node + TypeScript + Express + CORS + Axios
# ===============================================

echo "📁 Inicializando nuevo proyecto Node.js..."
npm init -y

echo "📦 Instalando TypeScript y dependencias de desarrollo..."
npm install --save-dev typescript ts-node @types/node nodemon

echo "📦 Instalando librerías principales (Express, CORS, Axios)..."
npm install express cors axios

echo "📘 Instalando tipos para TypeScript..."
npm install --save-dev @types/express @types/cors @types/axios

echo "⚙️ Creando archivo tsconfig.json..."
npx tsc --init

echo "📂 Creando archivo principal..."
touch index.ts

echo "🧹 Creando archivo .gitignore..."
cat <<EOL > .gitignore
/node_modules
.env
EOL

echo "🧩 Configurando package.json..."

# 1️⃣ Insertar "type": "module" antes de la sección "scripts"
sed -i 's#"version": "1.0.0",#"version": "1.0.0",\n  "type": "module",#' package.json

# 2️⃣ Sustituir los scripts originales por los personalizados
sed -i 's#"test": "echo.*exit 1"#"start": "ts-node index.ts",\
    "build": "tsc",\
    "dev": "nodemon --exec ts-node index.ts"#' package.json

echo "✅ Proyecto configurado correctamente."
echo ""
echo "👉 Ejecuta en modo desarrollo: npm run dev"
echo "👉 Compila TypeScript: npm run build"
echo "👉 Ejecuta el proyecto: npm start"
echo "🚀 Todo listo, leyenda del terminal."

