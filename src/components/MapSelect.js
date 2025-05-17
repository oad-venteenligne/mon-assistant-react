// src/components/MapSelect.js
import React, { useState, useEffect } from 'react';

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

// Groupement des départements par catégorie pour un affichage organisé
const departementGroups = {
  'Métropole Nord': ['02', '08', '51', '59', '60', '62', '76', '80'],
  'Métropole Est': ['10', '21', '25', '39', '52', '54', '55', '57', '67', '68', '70', '88', '90'],
  'Métropole Ouest': ['14', '22', '27', '29', '35', '44', '49', '50', '53', '56', '61', '72', '85'],
  'Métropole Centre': ['03', '15', '18', '23', '28', '36', '37', '41', '45', '58', '63', '71', '86', '87', '89'],
  'Métropole Sud-Ouest': ['09', '11', '12', '16', '17', '19', '24', '31', '32', '33', '40', '46', '47', '64', '65', '66', '79', '81', '82'],
  'Métropole Sud-Est': ['01', '04', '05', '06', '07', '13', '26', '30', '34', '38', '42', '43', '48', '69', '73', '74', '83', '84'],
  'Île-de-France': ['75', '77', '78', '91', '92', '93', '94', '95'],
  'Corse': ['2A', '2B'],
  'DOM-TOM': []
};

const MapSelect = ({ onSelect, selectedDepartements = [], regionFilter }) => {
  const [hoveredDepartement, setHoveredDepartement] = useState(null);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid'); // 'grid' ou 'list'

  // Filtrer les départements selon la région sélectionnée
  useEffect(() => {
    if (!regionFilter) {
      setFilteredDepartements([]);
      return;
    }
    
    setFilteredDepartements(departementsByRegion[regionFilter] || []);
  }, [regionFilter]);

  // Départements à afficher (filtrés par région et recherche)
  const getDepartementsToDisplay = () => {
    // Départements disponibles (tous ou filtrés par région)
    const availableDeps = regionFilter ? filteredDepartements : Object.keys(departementNames);
    
    // Filtrer par recherche si une requête est présente
    if (!searchQuery) return availableDeps;
    
    const lowerQuery = searchQuery.toLowerCase();
    return availableDeps.filter(dep => {
      const name = departementNames[dep].toLowerCase();
      return dep.includes(lowerQuery) || name.includes(lowerQuery);
    });
  };

  // Fonction pour sélectionner tous les départements disponibles
  const selectAllAvailable = () => {
    const departementsToSelect = getDepartementsToDisplay();
    
    departementsToSelect.forEach(dep => {
      if (!selectedDepartements.includes(dep)) {
        onSelect(dep);
      }
    });
  };
  
  // Fonction pour désélectionner tous les départements disponibles
  const deselectAllAvailable = () => {
    const departementsToDeselect = getDepartementsToDisplay();
    
    departementsToDeselect.forEach(dep => {
      if (selectedDepartements.includes(dep)) {
        onSelect(dep);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Information sur la région sélectionnée */}
        <div>
          {regionFilter ? (
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-3 rounded-lg">
              <div className="font-semibold">Région : {regionNames[regionFilter]}</div>
              <div className="text-sm">Sélectionnez les départements qui vous intéressent</div>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Tous les départements</span>
              <p className="text-sm">Aucune région sélectionnée. Vous pouvez sélectionner des départements dans toute la France.</p>
            </div>
          )}
        </div>
        
        {/* Actions rapides */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={selectAllAvailable}
            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            Tout sélectionner
          </button>
          <button 
            onClick={deselectAllAvailable}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Tout désélectionner
          </button>
          <button 
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            {view === 'grid' ? 'Vue liste' : 'Vue grille'}
          </button>
        </div>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Rechercher un département..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Information sur les départements filtrés */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {getDepartementsToDisplay().length} départements disponibles. 
        {selectedDepartements.length > 0 && ` ${selectedDepartements.length} sélectionné(s).`}
      </div>
      
      {/* Affichage des départements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 mb-4">
        {/* Selon la vue choisie */}
        {view === 'grid' ? (
          // Vue en grille
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {getDepartementsToDisplay().map(dep => (
              <div 
                key={dep}
                onClick={() => onSelect(dep)}
                onMouseEnter={() => setHoveredDepartement(dep)}
                onMouseLeave={() => setHoveredDepartement(null)}
                className={`cursor-pointer p-2 rounded-md text-center transition-colors ${
                  selectedDepartements.includes(dep)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold' 
                    : hoveredDepartement === dep
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="font-medium">{dep}</div>
                <div className="text-xs truncate">{departementNames[dep]}</div>
              </div>
            ))}
          </div>
        ) : (
          // Vue en liste
          <div>
            {/* On affiche les départements groupés par catégorie */}
            {Object.entries(departementGroups).map(([groupName, deps]) => {
              // Filtrer les départements de ce groupe qui sont disponibles selon les filtres actuels
              const availableDeps = deps.filter(dep => getDepartementsToDisplay().includes(dep));
              
              // Ne pas afficher le groupe s'il ne contient aucun département disponible
              if (availableDeps.length === 0) return null;
              
              return (
                <div key={groupName} className="mb-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{groupName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {availableDeps.map(dep => (
                      <div 
                        key={dep}
                        onClick={() => onSelect(dep)}
                        onMouseEnter={() => setHoveredDepartement(dep)}
                        onMouseLeave={() => setHoveredDepartement(null)}
                        className={`cursor-pointer p-2 rounded-md flex items-center transition-colors ${
                          selectedDepartements.includes(dep)
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-semibold' 
                            : hoveredDepartement === dep
                              ? 'bg-gray-100 dark:bg-gray-700'
                              : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="w-8 text-center font-medium">{dep}</div>
                        <div className="ml-2">{departementNames[dep]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Section d'information - département survolé et sélectionnés */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
        {/* Département survolé */}
        {hoveredDepartement && (
          <div className="text-center mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-semibold text-lg">{hoveredDepartement} - {departementNames[hoveredDepartement]}</div>
            <div className="text-sm">
              {selectedDepartements.includes(hoveredDepartement) 
                ? <span className="text-green-600 dark:text-green-400">✓ Sélectionné</span>
                : <span className="text-gray-500 dark:text-gray-400">Cliquez pour sélectionner</span>
              }
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>Cliquez sur un département pour le sélectionner ou le désélectionner.</p>
          <p>Vous pouvez sélectionner plusieurs départements pour élargir votre zone de commercialisation.</p>
        </div>
      </div>
    </div>
  );
};

export default MapSelect;