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

// Départements par région
const departementsByRegion = {
  '1': ['01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'], // Auvergne-Rhône-Alpes
  '2': ['21', '25', '39', '58', '70', '71', '89', '90'], // Bourgogne-Franche-Comté
  '3': ['22', '29', '35', '56'], // Bretagne
  '4': ['18', '28', '36', '37', '41', '45'], // Centre-Val de Loire
  '5': ['2A', '2B'], // Corse
  '6': ['08', '10', '51', '52', '54', '55', '57', '67', '68', '88'], // Grand Est
  '7': ['02', '59', '60', '62', '80'], // Hauts-de-France
  '8': ['75', '77', '78', '91', '92', '93', '94', '95'], // Île-de-France
  '9': ['14', '27', '50', '61', '76'], // Normandie
  '10': ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'], // Nouvelle-Aquitaine
  '11': ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'], // Occitanie
  '12': ['44', '49', '53', '72', '85'], // Pays de la Loire
  '13': ['04', '05', '06', '13', '83', '84'] // Provence-Alpes-Côte d'Azur
};

// Noms des régions
const regionNames = {
  '1': 'Auvergne-Rhône-Alpes',
  '2': 'Bourgogne-Franche-Comté',
  '3': 'Bretagne',
  '4': 'Centre-Val de Loire',
  '5': 'Corse',
  '6': 'Grand Est',
  '7': 'Hauts-de-France',
  '8': 'Île-de-France',
  '9': 'Normandie',
  '10': 'Nouvelle-Aquitaine',
  '11': 'Occitanie',
  '12': 'Pays de la Loire',
  '13': 'Provence-Alpes-Côte d\'Azur'
};

const MapSelect = ({ onSelect, selectedDepartements = [], regionFilter }) => {
  const [hoveredDepartement, setHoveredDepartement] = useState(null);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 600 600");

  // Couleurs pour les départements sur la carte
  const colors = {
    base: '#e5e7eb',       // gris clair pour les départements non sélectionnés
    hover: '#d1d5db',      // gris un peu plus foncé pour le survol
    selected: '#10b981',   // vert pour les départements sélectionnés
    disabled: '#f3f4f6',   // gris très clair pour les départements désactivés
    text: '#1f2937',       // couleur du texte des infobulles
    textLight: '#f9fafb'   // couleur du texte clair
  };

  // Ajustements du viewBox pour les régions spécifiques
  useEffect(() => {
    if (regionFilter === '5') { // Corse
      setViewBox("530 370 100 100");
    } else if (regionFilter === '8') { // Île-de-France
      setViewBox("320 200 50 50");
    } else if (regionFilter) {
      // Pour les autres régions, zoomer sur elles en utilisant les coordonnées de leurs départements
      setViewBox("0 0 600 600"); // Default view temporairement
    } else {
      setViewBox("0 0 600 600"); // Vue complète de la France
    }
  }, [regionFilter]);

  // Filtrer les départements selon la région sélectionnée
  useEffect(() => {
    if (!regionFilter) {
      // Si aucune région n'est sélectionnée, tous les départements sont disponibles
      setFilteredDepartements([]);
      return;
    }
    
    // Si une région est sélectionnée, on filtre les départements
    setFilteredDepartements(departementsByRegion[regionFilter] || []);
  }, [regionFilter]);
  
  // Liste complète des départements à afficher
  const allDepartements = [
    ...Array.from({ length: 19 }, (_, i) => (i + 1).toString().padStart(2, '0')),
    ...Array.from({ length: 76 }, (_, i) => (i + 21).toString().padStart(2, '0')),
    '2A', '2B' // Corse
  ];

  // Fonction pour gérer le clic sur un département
  const handleClick = (departement) => {
    // Si le département n'est pas dans la région filtrée, ne rien faire
    if (filteredDepartements.length > 0 && !filteredDepartements.includes(departement)) {
      return;
    }
    
    onSelect(departement);
  };

  // Déterminer la couleur d'un département
  const getDepartementColor = (departement) => {
    // Si le département est sélectionné
    if (selectedDepartements.includes(departement)) {
      return colors.selected;
    }
    
    // Si on a un filtre de région et que le département n'est pas dans la région
    if (filteredDepartements.length > 0 && !filteredDepartements.includes(departement)) {
      return colors.disabled;
    }
    
    // Si le département est survolé
    if (departement === hoveredDepartement) {
      return colors.hover;
    }
    
    // Couleur par défaut
    return colors.base;
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col md:flex-row md:gap-4">
        {/* Carte des départements - côté gauche sur écrans larges */}
        <div className="md:w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 md:mb-0">
          {/* Information sur la région sélectionnée */}
          {regionFilter && (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg mb-4">
              <div className="font-semibold">Région : {regionNames[regionFilter]}</div>
              <div className="text-sm">Cliquez sur les départements pour les sélectionner</div>
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
                  {selectedDepartements.includes(hoveredDepartement) 
                    ? <span className="text-green-600 dark:text-green-400">✓ Sélectionné</span>
                    : <span className="text-gray-500 dark:text-gray-400">Cliquez pour sélectionner</span>
                  }
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
              {filteredDepartements.length > 0 && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors.disabled }}></div>
                  <span className="text-sm">Hors région</span>
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
              {regionFilter && (
                <li>Seuls les départements de la région <span className="font-semibold">{regionNames[regionFilter]}</span> sont sélectionnables</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Message d'aide */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
        Sélectionnez les départements où vous souhaitez commercialiser vos produits.
      </div>
    </div>
  );
};

export default MapSelect;
