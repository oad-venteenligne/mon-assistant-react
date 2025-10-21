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
