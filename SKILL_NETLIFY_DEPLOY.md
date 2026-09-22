# SKILL: Deploy Efficace su Netlify (SPA Statica via Netlify Drop)

## 1. Contesto e Architettura Target
- Tipo di progetto: Web App / SPA statica frontend-only (nessuna fase di build o compilazione preventiva, entry point diretto index.html).
- Metodo di distribuzione: Netlify Drop (caricamento della cartella radice . del workspace).

## 2. Automazione dei File di Configurazione
Prima di qualsiasi notifica di deploy, verifica la presenza del file netlify.toml alla radice del progetto. Se manca, crealo automaticamente con la seguente configurazione anti-errore 404:

```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 3. Istruzioni di Deploy per l'Utente
Quando il codice è pronto per essere rilasciato:
1. Fornisci il percorso assoluto esatto della cartella da trascinare (la root di progetto corrente).
2. Ricorda all'utente di aprire https://app.netlify.com/drop (o la scheda Deploys del sito esistente) e rilasciare l'intera cartella.

## 4. Checklist di Sicurezza e Autorizzazioni Post-Deploy
Non appena l'utente fornisce o ottiene il dominio pubblico (es. https://nome-sito.netlify.app), genera automaticamente una checklist con i formati esatti da incollare nelle console esterne:

- Google Cloud Console (OAuth 2.0 Client):
  - Percorso: API e Servizi > Credenziali > ID client OAuth > Origini JavaScript autorizzate.
  - Valore da inserire: https://nome-sito.netlify.app (senza barra / finale).

- Firebase Authentication (Domini Autorizzati):
  - Percorso: Authentication > Settings > Authorized Domains.
  - Valore da inserire: solo hostname nome-sito.netlify.app (senza https:// e senza barre).

- Google Maps API Key (se presente restrizione referer):
  - Percorso: API e Servizi > Credenziali > Chiave API > Restrizioni per siti web.
  - Valore da inserire: https://nome-sito.netlify.app/*
