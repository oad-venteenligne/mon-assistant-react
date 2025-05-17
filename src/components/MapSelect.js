// src/components/MapSelect.js - Composant mis à jour
import React, { useState, useEffect } from 'react';
import { MapDepartements } from '@socialgouv/react-departements';

// Nom des départements
const departementNames = {
  "01": "Ain", "02": "Aisne", "03": "Allier", "04": "Alpes-de-Haute-Provence", 
  "05": "Hautes-Alpes", "06": "Alpes-Maritimes", "07": "Ardèche", "08": "Ardennes",
  "09": "Ariège", "10": "Aube", "11": "Aude", "12": "Aveyron", "13": "Bouches-du-Rhône",
  "14": "Calvados", "15": "Cantal", "16": "Charente", "17": "Charente-Maritime", 
  "18": "Cher", "19": "Corrèze", "21": "Côte-d'Or", "22": "Côtes-d'Armor", 
  "23": "Creuse", "24": "Dordogne", "25": "Doubs", "26": "Drôme", "27": "Eure",
  "28": "Eure-et-Loir", "29": "Finistère", "2A": "Corse-du-Sud", "2B": "Haute-Corse",
  "30": "Gard", "31": "Haute-Garonne", "32": "Gers", "33": "Gironde", "34": "Hérault",
  "35": "Ille-et-Vilaine", "36": "Indre", "37": "Indre-et-Loire", "38": "Isère", 
  "39": "Jura", "40": "Landes", "41": "Loir-et-Cher", "42": "Loire", "43": "Haute-Loire",
  "44": "Loire-Atlantique", "45": "Loiret", "46": "Lot", "47": "Lot-et-Garonne", 
  "48": "Lozère", "49": "Maine-et-Loire", "50": "Manche", "51": "Marne", 
  "52": "Haute-Marne", "53": "Mayenne", "54": "Meurthe-et-Moselle", "55": "Meuse",
  "56": "Morbihan", "57": "Moselle", "58": "Nièvre", "59": "Nord", "60": "Oise",
  "61": "Orne", "62": "Pas-de-Calais", "63": "Puy-de-Dôme", "64": "Pyrénées-Atlantiques",
  "65": "Hautes-Pyrénées", "66": "Pyrénées-Orientales", "67": "Bas-Rhin", 
  "68": "Haut-Rhin", "69": "Rhône", "70": "Haute-Saône", "71": "Saône-et-Loire",
  "72": "Sarthe", "73": "Savoie", "74": "Haute-Savoie", "75": "Paris", 
  "76": "Seine-Maritime", "77": "Seine-et-Marne", "78": "Yvelines", "79": "Deux-Sèvres",
  "80": "Somme", "81": "Tarn", "82": "Tarn-et-Garonne", "83": "Var", "84": "Vaucluse",
  "85": "Vendée", "86": "Vienne", "87": "Haute-Vienne", "88": "Vosges", "89": "Yonne",
  "90": "Territoire de Belfort", "91": "Essonne", "92": "Hauts-de-Seine", 
  "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise"
};

const MapSelect = ({ onSelect, selectedDepartements = [], availableDepartements = [] }) => {
  const [hoveredDepartement, setHoveredDepartement] = useState(null);
  const [viewBox, setViewBox] = useState("0 0 600 600");

  // Ajuster le viewBox en fonction des départements disponibles
  useEffect(() => {
    // Ici, on pourrait ajuster le viewBox de manière dynamique en fonction des départements disponibles
    // Pour simplifier, on garde une vue complète de la France
    setViewBox("0 0 600 600");
  }, [availableDepartements]);

  // Couleurs pour les départements sur la carte
  const colors = {
    base: '#e5e7eb',       // gris clair pour les départements non sélectionnés
    hover: '#d1d5db',      // gris un peu plus foncé pour le survol
    selected: '#10b981',   // vert pour les départements sélectionnés
    disabled: '#f3f4f6',   // gris très clair pour les départements désactivés
    text: '#1f2937',       // couleur du texte des infobulles
    textLight: '#f9fafb'   // couleur du texte clair
  };

  // Liste complète des départements à afficher
  const allDepartements = [
    ...Array.from({ length: 19 }, (_, i) => (i + 1).toString().padStart(2, '0')),
    ...Array.from({ length: 76 }, (_, i) => (i + 21).toString().padStart(2, '0')),
    '2A', '2B' // Corse
  ];

  // Fonction pour gérer le clic sur un département
  const handleClick = (departement) => {
    // Si des départements sont spécifiés comme disponibles et que le département cliqué n'en fait pas partie
    if (availableDepartements.length > 0 && !availableDepartements.includes(departement)) {
      return; // On ne fait rien
    }
    
    // Sinon, on appelle la fonction onSelect fournie en prop
    onSelect(departement);
  };

  // Déterminer la couleur d'un département
  const getDepartementColor = (departement) => {
    // Si le département est sélectionné
    if (selectedDepartements.includes(departement)) {
      return colors.selected;
    }
    
    // Si on a des départements spécifiés comme disponibles et que le département n'en fait pas partie
    if (availableDepartements.length > 0 && !availableDepartements.includes(departement)) {
      return colors.disabled;
    }
    
    // Si le département est survolé et qu'il est disponible
    if (departement === hoveredDepartement) {
      if (availableDepartements.length === 0 || availableDepartements.includes(departement)) {
        return colors.hover;
      }
    }
    
    // Couleur par défaut
    return colors.base;
  };

  return (
    <div className="relative w-full mb-6">
      <div className="flex flex-col md:flex-row md:gap-4">
        {/* Carte des départements - côté gauche sur écrans larges */}
        <div className="md:w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-0">
          {/* Information sur les départements sélectionnables */}
          {availableDepartements.length > 0 && (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg mb-4">
              <div className="text-sm">
                {availableDepartements.length} départements disponibles pour la sélection.
                Cliquez sur les départements pour les sélectionner.
              </div>
            </div>
          )}
          
          {/* Carte interactive */}
          <div className="w-full max-w-2xl mx-auto">
            <MapDepartements 
              width="100%"
              height="auto"
              viewBox={viewBox}
              departements={allDepartements}
              getDepartementColor={getDepartementColor}
              onDepartementClick={handleClick}
              onDepartementHover={setHoveredDepartement}
              stroke="#fff"
              strokeWidth={0.5}
              style={{ maxHeight: '50vh' }}
            />
          </div>
        </div>
        
        {/* Panneau d'informations - côté droit sur écrans larges */}
        <div className="md:w-1/3 flex flex-col">
          {/* Département survolé */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 mb-4 h-24 flex items-center justify-center">
            {hoveredDepartement ? (
              <div className="text-center">
                <div className="font-semibold text-lg">{hoveredDepartement} - {departementNames[hoveredDepartement]}</div>
                <div className="text-sm mt-1">
                  {selectedDepartements.includes(hoveredDepartement) ? (
                    <span className="text-green-600 dark:text-green-400">✓ Sélectionné</span>
                  ) : availableDepartements.length > 0 && !availableDepartements.includes(hoveredDepartement) ? (
                    <span className="text-gray-500 dark:text-gray-400">Non disponible</span>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">Cliquez pour sélectionner</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center">
                Survolez un département pour voir les détails
              </div>
            )}
          </div>
          
          {/* Légende */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4">
            <h3 className="font-semibold mb-2">Légende</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors.base }}></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors.selected }}></div>
                <span className="text-sm">Sélectionné</span>
              </div>
              {availableDepartements.length > 0 && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors.disabled }}></div>
                  <span className="text-sm">Non disponible</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">Comment utiliser la carte</h3>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Cliquez sur un département pour le sélectionner</li>
              <li>Cliquez à nouveau pour le désélectionner</li>
              <li>Vous pouvez sélectionner plusieurs départements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelect;