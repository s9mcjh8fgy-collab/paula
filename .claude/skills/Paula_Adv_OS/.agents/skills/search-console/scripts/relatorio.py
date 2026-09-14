#!/usr/bin/env python3
"""
Search Console — Relatorio semanal
Consulta a API do Google Search Console (site paulacorrea.adv.br) via service account.

Uso:
  python3 relatorio.py resumo      # cliques/impressoes/ctr/posicao: semana atual vs anterior
  python3 relatorio.py paginas     # paginas com mais impressoes (ultimos 28 dias)
  python3 relatorio.py buscas      # termos de busca com mais impressoes (ultimos 28 dias)
  python3 relatorio.py tendencia   # serie diaria (ultimos 90 dias)
"""

import sys
import os
import json
import datetime

# ---------------------------------------------------------------------------
# .env.local loader (raiz do workspace 8_Claude)
# ---------------------------------------------------------------------------

def _find_workspace_root():
    """Sobe a arvore de diretorios ate achar o .env.local da raiz do 8_Claude."""
    path = os.path.dirname(os.path.abspath(__file__))
    for _ in range(10):
        if os.path.isfile(os.path.join(path, ".env.local")):
            return path
        parent = os.path.dirname(path)
        if parent == path:
            break
        path = parent
    return None


def _load_env_local(root):
    env = {}
    with open(os.path.join(root, ".env.local"), "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            env[key.strip()] = value.strip()
    return env


def _init_service():
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("ERRO: bibliotecas do Google nao instaladas.", file=sys.stderr)
        print("  Instale com: pip install google-api-python-client google-auth", file=sys.stderr)
        sys.exit(1)

    root = _find_workspace_root()
    if not root:
        print("ERRO: nao achei o .env.local na raiz do workspace (8_Claude).", file=sys.stderr)
        sys.exit(1)

    env = _load_env_local(root)
    site_url = env.get("GOOGLE_SEARCH_CONSOLE_SITE_URL")
    key_rel = env.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not site_url or not key_rel:
        print("ERRO: GOOGLE_SEARCH_CONSOLE_SITE_URL ou GOOGLE_SERVICE_ACCOUNT_JSON nao definidos no .env.local", file=sys.stderr)
        sys.exit(1)

    key_path = os.path.join(root, key_rel)
    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    creds = service_account.Credentials.from_service_account_file(key_path, scopes=scopes)
    service = build("searchconsole", "v1", credentials=creds)
    return service, site_url


def _query(service, site_url, body):
    return service.searchanalytics().query(siteUrl=site_url, body=body).execute()


def _print_json(obj):
    print(json.dumps(obj, indent=2, ensure_ascii=False, default=str))


# Dados do Search Console tem defasagem de ~2-3 dias.
DELAY_DAYS = 3


def cmd_resumo(service, site_url):
    end = datetime.date.today() - datetime.timedelta(days=DELAY_DAYS)
    week_start = end - datetime.timedelta(days=6)
    prev_end = week_start - datetime.timedelta(days=1)
    prev_start = prev_end - datetime.timedelta(days=6)

    atual = _query(service, site_url, {
        "startDate": str(week_start), "endDate": str(end), "dimensions": [],
    })
    anterior = _query(service, site_url, {
        "startDate": str(prev_start), "endDate": str(prev_end), "dimensions": [],
    })

    def row(r):
        rows = r.get("rows", [])
        return rows[0] if rows else {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0}

    _print_json({
        "periodo_atual": f"{week_start} a {end}",
        "atual": row(atual),
        "periodo_anterior": f"{prev_start} a {prev_end}",
        "anterior": row(anterior),
    })


def cmd_paginas(service, site_url):
    end = datetime.date.today() - datetime.timedelta(days=DELAY_DAYS)
    start = end - datetime.timedelta(days=28)
    r = _query(service, site_url, {
        "startDate": str(start), "endDate": str(end),
        "dimensions": ["page"], "rowLimit": 25,
    })
    _print_json(r.get("rows", []))


def cmd_buscas(service, site_url):
    end = datetime.date.today() - datetime.timedelta(days=DELAY_DAYS)
    start = end - datetime.timedelta(days=28)
    r = _query(service, site_url, {
        "startDate": str(start), "endDate": str(end),
        "dimensions": ["query"], "rowLimit": 25,
    })
    _print_json(r.get("rows", []))


def cmd_tendencia(service, site_url):
    end = datetime.date.today() - datetime.timedelta(days=DELAY_DAYS)
    start = end - datetime.timedelta(days=90)
    r = _query(service, site_url, {
        "startDate": str(start), "endDate": str(end),
        "dimensions": ["date"], "rowLimit": 100,
    })
    _print_json(r.get("rows", []))


COMMANDS = {
    "resumo": cmd_resumo,
    "paginas": cmd_paginas,
    "buscas": cmd_buscas,
    "tendencia": cmd_tendencia,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print(f"Uso: python3 {sys.argv[0]} [{'|'.join(COMMANDS)}]", file=sys.stderr)
        sys.exit(1)
    service, site_url = _init_service()
    COMMANDS[sys.argv[1]](service, site_url)


if __name__ == "__main__":
    main()
