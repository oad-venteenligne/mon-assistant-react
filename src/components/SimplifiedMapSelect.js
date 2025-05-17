// src/components/SimplifiedMapSelect.js
import React, { useState } from 'react';

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

// Regroupement des départements par région
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

// Liste complète de tous les départements
const allDepartements = [
  ...Array.from({ length: 19 }, (_, i) => (i + 1).toString().padStart(2, '0')),
  ...Array.from({ length: 76 }, (_, i) => (i + 21).toString().padStart(2, '0')),
  '2A', '2B'
];

const SimplifiedMapSelect = ({ onSelect, selectedDepartements = [], availableDepartements = [] }) => {
  const [hoveredDepartement, setHoveredDepartement] = useState(null);

  // Couleurs pour les états des départements
  const colors = {
    available: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600',
    selected: 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 border-green-500',
    disabled: 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
  };

  const handleClick = (departementId) => {
    // Si des départements sont spécifiés comme disponibles et que le département cliqué n'en fait pas partie
    if (availableDepartements.length > 0 && !availableDepartements.includes(departementId)) {
      return; // On ne fait rien
    }
    onSelect(departementId);
  };

  // Déterminer l'état d'un département
  const getDepartementState = (departementId) => {
    if (selectedDepartements.includes(departementId)) {
      return 'selected';
    }
    
    if (availableDepartements.length > 0 && !availableDepartements.includes(departementId)) {
      return 'disabled';
    }
    
    return 'available';
  };

  // Regrouper les départements par région pour un affichage organisé
  const getDisplayGroups = () => {
    // Créer des groupes pour toutes les régions
    const groups = {};
    Object.entries(departementsByRegion).forEach(([regionId, depts]) => {
      if (availableDepartements.length === 0 || depts.some(d => availableDepartements.includes(d))) {
        groups[regionId] = depts;
      }
    });
    return groups;
  };

  const displayGroups = getDisplayGroups();

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

  return (
    <div className="relative w-full mb-6">
      <div className="flex flex-col md:flex-row md:gap-4">
        {/* Liste de sélection des départements */}
        <div className="md:w-2/3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 overflow-auto mb-4 md:mb-0" style={{ maxHeight: '60vh' }}>
          {/* Information sur les départements sélectionnables */}
          {availableDepartements.length > 0 && (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg mb-4">
              <div className="text-sm">
                {availableDepartements.length} départements disponibles pour la sélection.
                Cliquez sur les départements pour les sélectionner.
              </div>
            </div>
          )}
          
          {/* Liste des départements par région */}
          <div className="space-y-4">
            {Object.entries(displayGroups).map(([regionId, depts]) => (
              <div key={regionId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h3 className="font-semibold mb-2">{regionNames[regionId]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {depts.map(deptId => {
                    const state = getDepartementState(deptId);
                    return (
                      <div
                        key={deptId}
                        onClick={() => handleClick(deptId)}
                        onMouseEnter={() => setHoveredDepartement(deptId)}
                        onMouseLeave={() => setHoveredDepartement(null)}
                        className={`cursor-pointer px-3 py-2 rounded-md border text-center transition-colors ${colors[state]}`}
                      >
                        <div className="font-medium">{deptId}</div>
                        <div className="text-xs truncate">{departementNames[deptId]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Panneau d'informations */}
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
                <div className="w-4 h-4 rounded-sm mr-2 bg-gray-100 dark:bg-gray-700"></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm mr-2 bg-green-100 dark:bg-green-900 border border-green-500"></div>
                <span className="text-sm">Sélectionné</span>
              </div>
              {availableDepartements.length > 0 && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-sm mr-2 bg-gray-50 dark:bg-gray-800"></div>
                  <span className="text-sm">Non disponible</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">Comment utiliser</h3>
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

export default SimplifiedMapSelect;