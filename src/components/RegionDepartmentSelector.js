// src/components/RegionDepartmentSelector.js
import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import SimplifiedMapSelect from './SimplifiedMapSelect';
import SelectedDepartements from './SelectedDepartements';

// Dictionnaire des noms de régions
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

// Composant principal pour la sélection de région et département
const RegionDepartmentSelector = ({ onComplete, initialData = {} }) => {
  const [step, setStep] = useState('region'); // 'region' ou 'department'
  const [selectedRegions, setSelectedRegions] = useState(initialData.selectedRegions || []);
  const [selectedDepartements, setSelectedDepartements] = useState(initialData.selectedDepartements || []);
  const [availableDepartements, setAvailableDepartements] = useState([]);

  // Mettre à jour les départements disponibles en fonction des régions sélectionnées
  useEffect(() => {
    if (selectedRegions.length > 0) {
      const depts = [];
      selectedRegions.forEach(regionId => {
        const regionDepts = departementsByRegion[regionId] || [];
        depts.push(...regionDepts);
      });
      setAvailableDepartements([...new Set(depts)]); // Supprimer les doublons
    } else {
      setAvailableDepartements([]);
    }
  }, [selectedRegions]);

  // Gestion du choix d'une région
  const handleRegionSelect = (regionId) => {
    setSelectedRegions(prev => {
      const isSelected = prev.includes(regionId);
      if (isSelected) {
        // Si on désélectionne une région, supprimer ses départements
        const regionDepts = departementsByRegion[regionId] || [];
        setSelectedDepartements(selectedDepartements.filter(dept => !regionDepts.includes(dept)));
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  // Gestion du choix d'un département
  const handleDepartementSelect = (departementId) => {
    setSelectedDepartements(prev => {
      const isSelected = prev.includes(departementId);
      if (isSelected) {
        return prev.filter(id => id !== departementId);
      } else {
        return [...prev, departementId];
      }
    });
  };

  // Supprimer un département sélectionné
  const handleRemoveDepartement = (departementId) => {
    setSelectedDepartements(prev => prev.filter(id => id !== departementId));
  };

  // Valider la sélection et passer à l'étape suivante ou finaliser
  const handleNext = () => {
    if (step === 'region') {
      if (selectedRegions.length > 0) {
        setStep('department');
      } else {
        alert("Veuillez sélectionner au moins une région");
      }
    } else if (step === 'department') {
      // Transmettre les données finales au composant parent
      onComplete({
        selectedRegions,
        selectedDepartements
      });
    }
  };

  // Revenir à l'étape précédente
  const handleBack = () => {
    if (step === 'department') {
      setStep('region');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-8 max-w-4xl mx-auto transition-all duration-300">
      {/* Étape de sélection des régions */}
      {step === 'region' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            Sélection des régions
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300 italic">
            Sélectionnez une ou plusieurs régions où vous souhaitez commercialiser vos produits.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {Object.entries(regionNames).map(([id, name]) => {
              const isSelected = selectedRegions.includes(id);
              return (
                <div
                  key={id}
                  onClick={() => handleRegionSelect(id)}
                  className={`border p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-600 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{name}</h3>
                    {isSelected && <CheckCircle size={18} className="text-green-500" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => onComplete({ cancel: true })}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Retour
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              disabled={selectedRegions.length === 0}
            >
              Suivant <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Étape de sélection des départements */}
      {step === 'department' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            Sélection des départements
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300 italic">
            Sélectionnez les départements dans les régions choisies ({selectedRegions.map(id => regionNames[id]).join(', ')}).
          </p>

          {/* Affichage des régions sélectionnées */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Régions sélectionnées ({selectedRegions.length})
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedRegions.map(regionId => (
                <div 
                  key={regionId} 
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{regionNames[regionId]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Carte de sélection des départements */}
          <SimplifiedMapSelect 
            onSelect={handleDepartementSelect}
            selectedDepartements={selectedDepartements}
            availableDepartements={availableDepartements}
          />
          
          {/* Liste des départements sélectionnés */}
          <SelectedDepartements 
            selectedDepartements={selectedDepartements}
            onRemove={handleRemoveDepartement}
          />

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Retour aux régions
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              disabled={selectedDepartements.length === 0}
            >
              Valider <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionDepartmentSelector;