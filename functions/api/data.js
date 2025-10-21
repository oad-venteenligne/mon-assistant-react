// Syntaxe Cloudflare Functions (au lieu de Vercel)
export async function onRequest(context) {
  try {
    const response = await fetch('https://www.oad-venteenligne.org/?api/forms/7/entries');
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Important pour éviter les erreurs CORS
      }
    });
  } catch (error) {
    console.error("Erreur API proxy :", error);
    
    return new Response(
      JSON.stringify({ error: "Erreur lors du chargement des données." }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
```

## Différences principales entre Vercel et Cloudflare :

| Vercel | Cloudflare |
|--------|------------|
| `export default function handler(req, res)` | `export async function onRequest(context)` |
| `res.status(200).json(data)` | `return new Response(JSON.stringify(data), { status: 200 })` |
| Dossier `/api/` | Dossier `/functions/` |

## Étape 3 : Structure finale

Votre structure de projet devrait ressembler à :
```
votre-projet/
├── functions/
│   └── api/
│       └── data.js  ← Votre fichier avec la nouvelle syntaxe
├── public/
├── src/
│   └── App.js  ← Appelle fetch("/api/data")
└── package.json