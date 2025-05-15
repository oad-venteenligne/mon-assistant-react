// src/components/SelectedDepartements.js
import React from 'react';

// Dictionnaire des noms de départements
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

const SelectedDepartements = ({ selectedDepartements, onRemove }) => {
  // Si aucun département sélectionné, afficher un message
  if (!selectedDepartements || selectedDepartements.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
        <p>Aucun département sélectionné</p>
        <p className="text-sm mt-1">Cliquez sur la carte pour sélectionner des départements</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Départements sélectionnés ({selectedDepartements.length})
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {selectedDepartements.map(dep => (
          <div 
            key={dep} 
            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full flex items-center gap-2 transition-all hover:bg-green-200 dark:hover:bg-green-800"
          >
            <span className="font-semibold">{dep}</span>
            <span className="text-sm hidden sm:inline">- {departementNames[dep] || 'Département'}</span>
            <button 
              onClick={() => onRemove && onRemove(dep)}
              className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 rounded-full flex items-center justify-center w-5 h-5 hover:bg-green-200 dark:hover:bg-green-800"
              aria-label={`Retirer ${dep}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDepartements;
