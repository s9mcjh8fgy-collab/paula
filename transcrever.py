"""
Transcreve todos os audios/videos de uma pasta usando Whisper.
Uso: python transcrever.py "caminho\\da\\pasta" [modelo]

Modelos (do mais rapido/menos preciso ao mais lento/mais preciso):
  tiny, base, small, medium, large
Padrao: small (bom equilibrio para portugues)
"""
import sys
import os
import whisper

EXTENSOES = {".mp3", ".wav", ".m4a", ".mp4", ".mov", ".avi", ".mkv", ".ogg", ".flac", ".wma", ".webm"}


def main():
    if len(sys.argv) < 2:
        print("Uso: python transcrever.py \"caminho\\da\\pasta\" [modelo]")
        sys.exit(1)

    pasta = sys.argv[1]
    modelo_nome = sys.argv[2] if len(sys.argv) > 2 else "small"

    if not os.path.isdir(pasta):
        print(f"Pasta nao encontrada: {pasta}")
        sys.exit(1)

    arquivos = [
        f for f in os.listdir(pasta)
        if os.path.splitext(f)[1].lower() in EXTENSOES
    ]

    if not arquivos:
        print("Nenhum audio/video encontrado nessa pasta.")
        sys.exit(0)

    print(f"Carregando modelo Whisper '{modelo_nome}' (primeira vez baixa o modelo, pode demorar)...")
    modelo = whisper.load_model(modelo_nome)

    for nome in arquivos:
        caminho = os.path.join(pasta, nome)
        saida = os.path.join(pasta, os.path.splitext(nome)[0] + ".txt")

        if os.path.exists(saida):
            print(f"[pulando, ja existe] {nome}")
            continue

        print(f"Transcrevendo: {nome}")
        resultado = modelo.transcribe(caminho, language="portuguese")

        with open(saida, "w", encoding="utf-8") as f:
            f.write(resultado["text"].strip())

        print(f"  -> salvo em {saida}")

    print("Concluido.")


if __name__ == "__main__":
    main()
