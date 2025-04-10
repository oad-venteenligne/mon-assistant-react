export default async function handler(req, res) {
    try {
      const response = await fetch('https://www.oad-venteenligne.org/?api/forms/7/entries');
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Erreur API proxy :", error);
      res.status(500).json({ error: "Erreur lors du chargement des données." });
    }
  }
  