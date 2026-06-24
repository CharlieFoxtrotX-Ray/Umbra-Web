#!/usr/bin/env bash
# Deploy Umbra-Web → KVM4
# Uso: ./deploy.sh [--dry-run]
set -euo pipefail

REMOTE="kvm4"                   # alias SSH de ~/.ssh/config
REMOTE_DIR="~/infra/umbra-web"  # se crea si no existe

DRY=""
[[ "${1:-}" == "--dry-run" ]] && DRY="--dry-run"

echo "→ Sincronizando con ${REMOTE}:${REMOTE_DIR} ${DRY:+(dry-run)} ..."
rsync -avz --delete ${DRY} \
  --exclude='.git/' \
  --exclude='infra/' \
  --exclude='deploy.sh' \
  . \
  "${REMOTE}:${REMOTE_DIR}/"

[[ -n "$DRY" ]] && echo "✓ Dry-run completado. Sin cambios reales." && exit 0
echo "✓ Deploy completado → ${REMOTE}:${REMOTE_DIR}"
