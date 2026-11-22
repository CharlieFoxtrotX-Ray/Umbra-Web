#!/usr/bin/env bash
# Deploy Umbra-Web → KVM4 desde Windows (Git Bash), sin rsync local.
# Uso: ./deploy-win.sh [--dry-run]
#
# Hace lo mismo que deploy.sh con dos diferencias:
#   1. Publica el commit HEAD (lo que está en git), no la carpeta de trabajo:
#      los cambios sin commitear y los archivos sueltos no salen.
#   2. El rsync corre en el servidor: desde acá solo viajan los archivos por SSH.
#      Compara por contenido (--checksum), así solo toca lo que cambió.
set -euo pipefail

REMOTE="kvm4"                   # alias SSH de ~/.ssh/config
REMOTE_DIR="infra/umbra-web"    # relativo al home del usuario remoto

DRY=""
[[ "${1:-}" == "--dry-run" ]] && DRY="--dry-run"

cd "$(dirname "$0")"
COMMIT="$(git rev-parse --short HEAD)"

if ! git diff --quiet HEAD -- . ; then
  echo "! Hay cambios sin commitear: NO se publican (solo sale el commit ${COMMIT})."
fi

echo "→ Publicando ${COMMIT} en ${REMOTE}:~/${REMOTE_DIR} ${DRY:+(dry-run)} ..."

# Mismas exclusiones que deploy.sh: lo excluido ni se copia ni se borra allá.
# core.autocrlf=false: los archivos viajan tal cual están en git (sin CRLF de Windows).
git -c core.autocrlf=false archive --format=tar.gz HEAD | ssh "$REMOTE" "
  set -euo pipefail
  T=\$(mktemp -d)
  trap 'rm -rf \"\$T\"' EXIT
  tar -xzf - -C \"\$T\"
  mkdir -p \"\$HOME/${REMOTE_DIR}\"
  rsync -rlv --checksum --delete ${DRY} \
    --exclude='.git/' \
    --exclude='.claude/' \
    --exclude='infra/' \
    --exclude='deploy.sh' \
    --exclude='deploy-win.sh' \
    --exclude='prototipo-v2.html' \
    --exclude='prototipo-discord.html' \
    --exclude='brand-kit/' \
    \"\$T\"/ \"\$HOME/${REMOTE_DIR}\"/
"

[[ -n "$DRY" ]] && echo "✓ Dry-run completado. Sin cambios reales." && exit 0
echo "✓ Deploy completado → ${REMOTE}:~/${REMOTE_DIR} (${COMMIT})"
