#!/bin/bash
# Commit + push rápido pro QA Shift-Left Suite.
# Uso:
#   ./commit.sh "mensagem do commit"
#   ./commit.sh            (usa uma mensagem com data/hora automática)

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

if [ -z "$(git status --porcelain)" ]; then
  echo "Nada pra commitar — nenhum arquivo mudou."
  exit 0
fi

MSG="${1:-Atualização $(date '+%Y-%m-%d %H:%M')}"
BRANCH="$(git branch --show-current)"

git add -A
git status --short
echo ""
echo "Commitando: $MSG"
git commit -m "$MSG"
git push origin "$BRANCH"

echo ""
echo "✅ Enviado para https://github.com/admirjuniorgit/qa-shift-left-suite (branch $BRANCH)"
