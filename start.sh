#!/bin/bash

# Script de démarrage pour TikTok Automation

set -e

echo "🚀 Démarrage de TikTok Automation Platform..."
echo ""

# Vérifier si .env existe
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Fichier .env manquant!"
    echo "📝 Création depuis .env.example..."
    cp .env.example backend/.env
    echo "✅ Fichier backend/.env créé"
    echo "⚠️  IMPORTANT: Modifiez backend/.env avec votre clé EMERGENT_LLM_KEY"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Création de frontend/.env..."
    echo "REACT_APP_BACKEND_URL=http://localhost:8001" > frontend/.env
    echo "✅ Fichier frontend/.env créé"
    echo ""
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "📥 Installez Docker depuis: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    echo "📥 Installez Docker Compose depuis: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Créer le répertoire pour les vidéos générées
mkdir -p backend/generated_videos
touch backend/generated_videos/.gitkeep

echo "🐳 Démarrage des conteneurs Docker..."
echo ""

# Démarrer les services
docker-compose up -d

echo ""
echo "⏳ Attente du démarrage des services (30 secondes)..."
sleep 30

echo ""
echo "✅ Services démarrés!"
echo ""
echo "📊 Statut des services:"
docker-compose ps
echo ""
echo "🌐 Accès à l'application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "📝 Logs en temps réel:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Arrêter l'application:"
echo "   docker-compose down"
echo ""
echo "💡 Astuce: Vérifiez que EMERGENT_LLM_KEY est bien configurée dans backend/.env"
echo ""
echo "🎉 L'application est prête! Ouvrez http://localhost:3000 dans votre navigateur"
