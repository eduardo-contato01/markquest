# OMR API Starter (FastAPI + OpenCV) — para iniciantes

Este projeto é um **pontapé inicial** para integrar seu site com uma **API de leitura de cartões-resposta (OMR)**.
Começa **simples**: o endpoint `/scan` devolve **respostas falsas** (mock) só para você testar o fluxo de upload → resposta JSON.
Depois, você vai substituir pela leitura real com OpenCV.

---

## 🚀 Como rodar localmente

1. **Instale o Python 3.10+** (verifique com `python --version`)
2. **Crie e ative um ambiente virtual (recomendado)**

   **Windows:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   **macOS / Linux:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicie o servidor**
   ```bash
   uvicorn app:app --reload
   ```

5. **Teste a saúde**
   - Abra: `http://localhost:8000/health`

6. **Teste o upload (fake)**
   - Use o arquivo em `sample/sample-sheet.jpg` ou qualquer JPG/PNG.
   - Com o web demo (abaixo) ou via curl/Postman:
     ```bash
     curl -X POST "http://localhost:8000/scan" -F "file=@sample/sample-sheet.jpg"
     ```

---

## 🧩 Endpoints

- `GET /health` → status do serviço.
- `POST /scan` → recebe uma imagem e retorna JSON com respostas **falsas** para validar a integração do seu site.
  - Query params opcionais: `questions` (padrão 10), `options_per_question` (padrão 5).

**Exemplo de resposta:**
```json
{
  "status": "ok",
  "meta": { "filename": "minhaProva.jpg", "questions": 10, "options_per_question": 5 },
  "answers": [
    {"question": 1, "option": "A", "confidence": 0.85},
    {"question": 2, "option": "B", "confidence": 0.85},
    ...
  ]
}
```

---

## 🌐 Demo Web (frente simples)

Na pasta `web_demo/` há um `index.html` com um formulário de upload que **chama a API** e exibe o JSON.
Abra o arquivo no navegador e lembre-se de ajustar `API_URL` no `script.js` se mudar a porta/host.

---

## 🔧 Próximos passos (quando você estiver pronto)

1. **Substituir o mock por leitura real**:
   - Converter para tons de cinza, aplicar limiar (threshold).
   - Detectar bordas/contornos (Canny) e usar `warpPerspective` para alinhar a folha.
   - Mapear regiões de bolhas (com base num template) e medir densidade de pixels escuros.
   - Definir limiares e heurísticas para escolher a opção marcada.
2. **Templates configuráveis**: um arquivo JSON com as coordenadas das áreas de questões para diferentes folhas.
3. **Confiança e validação**: detectar múltiplas marcações, omissões e retornar `confidence`.
4. **Suporte a PDF**: converter página para imagem antes (ex.: `pdf2image`).
