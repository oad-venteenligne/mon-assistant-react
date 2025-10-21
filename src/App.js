import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, CheckCircle, ExternalLink, Search, HelpCircle } from 'lucide-react';
import RegionDepartmentSelector from './components/RegionDepartmentSelector';


// Imports pour Firebase
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

// Configuration des questions
const questions = [
  {
    id: 'welcome',
    title: "Bienvenue dans l'assistant de sélection",
    description: "Nous allons vous aider à trouver les meilleures plateformes en ligne pour commercialiser vos produits alimentaires en répondant à quelques questions.",
    type: 'welcome',
    nextQuestion: 'location_scope'
  },
{
  id: 'location_scope',
  title: "Quelle est la portée géographique que vous recherchez ?",
  description: "Choisissez si vous souhaitez des plateformes disponibles partout en France ou spécifiques à votre région.",
  type: 'choice',
  choices: [
    { id: '1', label: 'France entière', description: "Plateformes disponibles dans toute la France" },
    { id: '2', label: 'Restriction géographique', description: "Plateformes spécifiques à ma région ou mon département" }
  ],
  filter: 'listeListeOuinonid_echellelocalisation',
  multiple: false,
  nextQuestion: (answer) => {
    if (answer === '2') {
      return 'geographic_selection';
    } else {
      return 'platform';
    }
  }
},
{
  id: 'geographic_selection',
  title: "Sélection géographique",
  description: "Sélectionnez les régions et départements qui vous intéressent.",
  type: 'geographic_selector', // Nouveau type de question
  nextQuestion: 'platform'
},
{
  id: 'platform',
  title: "Quel type d'outil recherchez-vous principalement ?",
  description: "Choisissez le type d'outil qui correspond le mieux à vos besoins.",
  type: 'choice',
  choices: [
    { id: '1', label: 'Générateur de Boutique', description: "Pour créer votre propre boutique en ligne" },
    { id: '2', label: 'Place de Marché', description: "Pour vendre sur une plateforme qui rassemble plusieurs vendeurs" },
    { id: '3', label: 'Outil de Gestion', description: "Pour gérer vos commandes et votre logistique" }
  ],
  filter: 'listeListeTypeplateforme',
  multiple: false,
  nextQuestion: 'multiproducer'
},
  {
  id: 'multiproducer',
  title: "Souhaitez-vous vendre seulement vos propres produits ou les produits de plusieurs producteurs ?",
  description: "Cette information nous permettra de vous proposer des outils adaptés à votre mode de fonctionnement.",
  type: 'choice',
  choices: [
    { id: 'yes', label: 'Oui, je souhaite vendre les produits de plusieurs producteurs', description: "Je veux proposer une offre diversifiée de plusieurs producteurs" },
    { id: 'no', label: 'Non, je souhaite uniquement vendre mes propres produits', description: "Je souhaite uniquement commercialiser ma production" },
  ],
  filter: 'multiproducer',
  multiple: false,
  nextQuestion: (answer) => {
    if (answer === 'yes') {
      return 'multiproducer_services';
    } else {
      return 'clients';
    }
  }
},
{
  id: 'multiproducer_services',
  title: "Quels services de vente à plusieurs recherchez-vous ?",
  description: "Sélectionnez les fonctionnalités qui vous aideront à gérer la vente de produits de plusieurs producteurs.",
  type: 'choice',
  choices: [
    { id: 'plusieurscomptes', label: 'Accès du compte à plusieurs', description: "Permettre à chaque producteur d'accéder à son espace" },
    { id: 'commissionpersonalisee', label: 'Commission personnalisée par producteur', description: "Définir des commissions différentes selon les producteurs" },
    { id: 'repartitionpaiements', label: 'Répartition des paiements', description: "Distribuer automatiquement les paiements entre producteurs" },
    { id: 'datelimite', label: 'Paramétrage de dates limites par producteur', description: "Dates de commande adaptables à chaque producteur" }
  ],
  filter: 'ouinonFields',
  filterMapping: {
    'plusieurscomptes': 'listeListeOuinonid_plusieurscomptes',
    'commissionpersonalisee': 'listeListeOuinonid_commissionpersonalisee',
    'repartitionpaiements': 'listeListeOuinonid_repartitionpaiements',
    'datelimite': 'listeListeOuinonid_datelimite'
  },
  multiple: true,
  nextQuestion: 'clients'
},
  {
    id: 'clients',
    title: "À quels types d'acheteurs souhaitez-vous vendre ?",
    description: "Sélectionnez un ou plusieurs types de clientèle.",
    type: 'choice',
    choices: [
      { id: '1', label: 'Consommateurs particuliers', description: "Vente directe aux particuliers" },
      { id: '2', label: 'Restauration collective', description: "Écoles, hôpitaux, entreprises..." },
      { id: '3', label: 'Restauration commerciale', description: "Restaurants, traiteurs..." },
      { id: '4', label: 'GMS', description: "Grandes et moyennes surfaces" },
      { id: '5', label: 'Commerces de proximité', description: "Épiceries, magasins spécialisés..." },
      { id: '6', label: 'Grossistes', description: "Distribution intermédiaire" },
      { id: '7', label: 'Transformateurs', description: "Industries agroalimentaires" },
      { id: '8', label: 'Producteurs', description: "Autres producteurs agricoles" }
    ],
    filter: 'checkboxListeTypeclientid_typeclient',
    multiple: true,
    nextQuestion: 'products'
  },
  {
    id: 'products',
    title: "Quels types de produits souhaitez-vous commercialiser ?",
    description: "Sélectionnez les catégories de produits que vous proposez.",
    type: 'choice',
    choices: [
      { id: '1', label: 'Fruits et légumes', icon: '🥕' },
      { id: '2', label: 'Produits d\'épicerie', icon: '🥫' },
      { id: '3', label: 'Produits carnés', icon: '🥩' },
      { id: '4', label: 'Produits de la pêche', icon: '🐟' },
      { id: '5', label: 'Produits laitiers', icon: '🧀' },
      { id: '6', label: 'Produits non alimentaires', icon: '🛍️' }
    ],
    filter: 'checkboxListeProduitcommercialiseid_produitscommercialises',
    multiple: true,
    nextQuestion: 'cost'
  },
  {
    id: 'cost',
    title: "Quel modèle économique préférez-vous ?",
    description: "Comment souhaitez-vous que l'outil se finance ?",
    type: 'choice',
    choices: [
      { id: '1', label: 'Totalement gratuit', description: "Sans frais pour vous ou vos clients" },
      { id: '2', label: 'Commission prélevée au producteur', description: "Pourcentage sur vos ventes" },
      { id: '3', label: 'Abonnement pour le producteur', description: "Frais fixes mensuels ou annuels" },
      { id: '4', label: 'Commission prélevée au consommateur', description: "Frais supportés par l'acheteur" },
      { id: '5', label: 'Abonnement pour le consommateur', description: "L'acheteur paie un accès à la plateforme" }
    ],
    filter: 'checkboxListeCoutplateformeid_coutplateforme',
    multiple: true,
    nextQuestion: 'selling'
  },
  {
    id: 'selling',
    title: "Comment souhaitez-vous vendre vos produits ?",
    description: "Choisissez le mode de vente qui vous convient.",
    type: 'choice',
    choices: [
      { id: '1', label: 'Vente permanente', description: "Boutique ouverte en continu" },
      { id: '2', label: 'Vente par sessions', description: "Ouverture des commandes sur des périodes définies" }
    ],
    filter: 'checkboxListeModaliteventeid_modalitevente',
    multiple: true,
    nextQuestion: 'order_system'
  },
  {
    id: 'order_system',
    title: "Quel système de commande préférez-vous ?",
    description: "Choisissez comment vos clients composeront leurs commandes.",
    type: 'choice',
    choices: [
      { id: '1', label: 'Composition libre du panier', description: "Les clients choisissent librement ce qu'ils achètent" },
      { id: '2', label: 'Paniers pré-composés avec abonnement', description: "Paniers préparés à l'avance avec engagement" },
      { id: '3', label: 'Paniers pré-composés sans abonnement', description: "Paniers préparés à l'avance sans engagement" }
    ],
    filter: 'checkboxListeSystemecommandeid_systemecommande',
    multiple: true,
    nextQuestion: 'payment_options'
  },
  
{
  id: 'payment_options',
  title: "Quelles options de paiement souhaitez-vous ?",
  description: "Sélectionnez les méthodes de paiement que vous voulez proposer à vos clients.",
  type: 'choice',
  choices: [
    { id: '1', label: 'Paiement en ligne à la commande', description: "Les clients paient en ligne au moment de commander" },
    { id: '2', label: 'Paiement à la livraison', description: "Les clients paient lors de la réception des produits" }
  ],
  filter: 'checkboxListeOptionpaiementid_optionpaiement',
  multiple: true,
  nextQuestion: 'weight_adjustment'
},
{
  id: 'weight_adjustment',
  title: "Avez-vous besoin d'ajuster le poids des produits ?",
  description: "Indiquez si vous avez besoin d'ajuster le poids des produits après la commande.",
  type: 'choice',
  choices: [
    { id: 'yes', label: 'Oui', description: "J'ai besoin d'ajuster le poids des produits après la commande" },
    { id: 'no', label: 'Non', description: "Pas besoin d'ajustement de poids" }
  ],
  filter: 'listeListe19Ajustement',
  multiple: false,
  nextQuestion: 'logistics'
},
  {
    id: 'logistics',
    title: "Quelles fonctionnalités logistiques sont importantes pour vous ?",
    description: "Sélectionnez les options qui vous intéressent.",
    type: 'choice',
    choices: [
      { id: 'cliccollect', label: 'Click & Collect', description: "Retrait des commandes en point de vente" },
      { id: 'zonelivraison', label: 'Paramétrages de zones de livraisons', description: "Définir des secteurs géographiques de livraison" },
      { id: 'solutionlogistique', label: 'Partenariats solutions logistique', description: "Accès à des services logistiques partenaires" },
      { id: 'colivraison', label: 'Système de co-livraison', description: "Mutualisation des livraisons entre producteurs" }
    ],
    filter: 'ouinonFields',
    filterMapping: {
      'cliccollect': 'listeListeOuinonid_cliccollect',
      'zonelivraison': 'listeListeOuinonid_zonelivraison',
      'solutionlogistique': 'listeListeOuinonid_solutionlogistique',
      'colivraison': 'listeListeOuinonid_colivraison'
    },
    multiple: true,
    nextQuestion: 'management'
  },
   {
    id: 'management',
    title: "Quelles fonctionnalités de gestion vous sont nécessaires ?",
    description: "Sélectionnez les outils qui vous aideront à gérer votre activité.",
    type: 'choice',
    choices: [
      { id: 'facturation', label: 'Facturation automatique', description: "Génération de factures" },
      { id: 'bonslivraison', label: 'Bons de commande/livraison', description: "Documents de suivi des commandes" },
      { id: 'reduc', label: 'Offres et réductions', description: "Création de promotions" },
      { id: 'bdd', label: 'Extraction de données', description: "Export des données clients et ventes" },
      { id: 'notation', label: 'Notation par les clients', description: "Système d'avis et évaluations" },
      { id: 'contractualisation', label: 'Fonctionnalités de contractualisation', description: "Gestion des contrats entre producteurs et acheteurs" }
    ],
    filter: 'ouinonFields',
    filterMapping: {
      'facturation': 'listeListeOuinonid_facturation',
      'bonslivraison': 'listeListeOuinonid_bonslivraison',
      'reduc': 'listeListeOuinonid_reduc',
      'bdd': 'listeListeOuinonid_bdd',
      'notation': 'listeListeOuinonid_notation',
      'contractualisation': 'listeListeOuinonid_contractualisation'
    },
    multiple: true,
    nextQuestion: 'communication'
  },
  
{
  id: 'communication',
  title: "Quelles fonctionnalités de communication recherchez-vous ?",
  description: "Sélectionnez les options pour communiquer avec vos clients.",
  type: 'choice',
  choices: [
    { id: 'pagepersonnalise', label: 'Personnalisation graphique', description: "Adapter l'apparence à votre marque" },
    { id: 'url', label: 'URL personnalisée', description: "Avoir votre propre nom de domaine" },
    { id: 'seo', label: 'Support SEO', description: "Optimisation pour les moteurs de recherche" },
    { id: 'socialnetworks', label: 'Intégration réseaux sociaux', description: "Connexion avec vos comptes sociaux" },
    { id: 'emailing', label: 'Emailing et notifications', description: "Communication automatisée avec vos clients" },
    { id: 'messagerie', label: 'Messagerie Instantanée', description: "Échanger en direct avec vos clients" },
    { id: 'com', label: 'Modèles de PLV ou supports de communication', description: "Matériel promotionnel pour le point de vente" },
    { id: 'carte', label: 'Carte en ligne publique', description: "Référencement de l'ensemble des producteurs" }
  ],
  filter: 'ouinonFields',
  filterMapping: {
    'pagepersonnalise': 'listeListeOuinonid_pagepersonnalise',
    'url': 'listeListeOuinonid_url',
    'seo': 'listeListeOuinonid_seo',
    'socialnetworks': 'listeListeOuinonid_socialnetworks',
    'emailing': 'listeListeOuinonid_emailing',
    'messagerie': 'listeListeOuinonid_messagerie',
    'com': 'listeListeOuinonid_com',
    'carte': 'listeListeOuinonid_carte'
  },
  multiple: true,
  nextQuestion: 'digital_platform'
},
 
{
  id: 'digital_platform',
  title: "Quel support numérique souhaitez-vous ?",
  description: "Sélectionnez le type de support numérique qui vous intéresse pour votre outil de vente.",
  type: 'choice',
  choices: [
    { id: '1', label: 'Site internet', description: "Une plateforme accessible depuis un navigateur web" },
    { id: '2', label: 'Application mobile', description: "Une application dédiée pour smartphones et tablettes" }
  ],
  filter: 'checkboxListe021Typesupportplateformeid_typesupportplateforme',
  multiple: true,
  nextQuestion: 'user_info'
},
  
  
  // Nouvelles questions pour le mini-questionnaire
  {
    id: 'user_info',
    title: "Pour mieux vous connaître",
    description: "Ces informations nous aideront à améliorer notre outil. Elles resteront confidentielles.",
    type: 'choice',
    choices: [
      { id: 'producer', label: 'Je suis producteur', description: "Agriculteur, éleveur, maraîcher..." },
      { id: 'distributor', label: 'Je suis distributeur', description: "Organisateur de circuit court, épicerie..." },
      { id: 'service', label: 'Je suis accompagnateur', description: "Conseil, développement, formation..." },
      { id: 'other', label: 'Autre', description: "Consommateur, étudiant, curieux..." }
    ],
    filter: 'userProfile',
    multiple: false,
    nextQuestion: 'contact_info'
  },
  {
    id: 'contact_info',
    title: "Souhaitez-vous être informé des mises à jour ?",
    description: "Laissez-nous votre email si vous souhaitez recevoir des informations sur les nouvelles plateformes et fonctionnalités.",
    type: 'email',
    nextQuestion: 'final'
  },
  {
    id: 'final',
    title: "Merci pour vos réponses !",
    description: "Nous avons sélectionné les plateformes qui correspondent le mieux à vos besoins.",
    type: 'results'
  }
];

// Types de plateformes et leurs labels
const platformTypes = {
  "1": "Générateur de Boutique",
  "2": "Place de Marché",
  "3": "Outil de Gestion"
};

// Convertir année numérique en année réelle
function getYearFromNumber(number) {
  const baseYear = 2005;
  return number && !isNaN(number) ? baseYear + (parseInt(number) - 1) : "Non renseigné";
}

// Composant principal
const Assistant = () => {
  // États
  const [currentQuestionId, setCurrentQuestionId] = useState('welcome');
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  // Nouvel état pour les choix de départements dynamiques
  const [departmentChoices, setDepartmentChoices] = useState([]);

  // Index des questions pour la navigation
  const questionIndex = questions.reduce((acc, q, idx) => {
    acc[q.id] = idx;
    return acc;
  }, {});

  // Charger les données initiales
useEffect(() => {
  // Essayer de charger depuis le localStorage d'abord
  const cachedDataString = localStorage.getItem('toolsDataCache');
  const cacheTimestampString = localStorage.getItem('toolsDataCacheTimestamp');
  
  if (cachedDataString && cacheTimestampString) {
    try {
      // Vérifier si le cache est périmé (par exemple après 1 jours)
      const cacheTimestamp = parseInt(cacheTimestampString);
      const currentTime = Date.now();
      const cacheExpirationMs = 24 * 60 * 60 * 1000; // 1 jours en millisecondes
      
      if (currentTime - cacheTimestamp < cacheExpirationMs) {
        // Le cache n'est pas périmé, on l'utilise
        setData(JSON.parse(cachedDataString));
        setLoading(false);
      } else {
        // Le cache est périmé, on récupère de nouvelles données
        fetchData();
      }
    } catch (e) {
      console.error("Erreur lors de la lecture du cache:", e);
      fetchData();
    }
  } else {
    fetchData();
  }
}, []);

// Fonction pour fetcher les données modifiée
const fetchData = () => {
  setLoading(true);
  
  // Simulation de chargement pour la démo
  // En production, utilisez votre API réelle
  setTimeout(() => {
    fetch("/api/data")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur réseau: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const dataArray = Object.values(data);
        setData(dataArray);
        
        // Mettre en cache avec un timestamp
        try {
          localStorage.setItem('toolsDataCache', JSON.stringify(dataArray));
          localStorage.setItem('toolsDataCacheTimestamp', Date.now().toString());
        } catch (e) {
          console.warn("Impossible de mettre en cache les données:", e);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      });
  }, 1000);
};
  // Mettre à jour les départements lorsque la région est sélectionnée
  useEffect(() => {
    if (currentQuestionId === 'department_selection' && answers['region_selection']) {
      const regionId = answers['region_selection'];
      const question = questions.find(q => q.id === 'department_selection');
      if (question && question.getDepartmentChoices) {
        const choices = question.getDepartmentChoices(regionId);
        setDepartmentChoices(choices);
      }
    }
  }, [currentQuestionId, answers]);

   // Mettre à jour la barre de progression
  useEffect(() => {
    if (currentQuestionId === 'welcome') {
      setProgress(0);
    } else if (currentQuestionId === 'final') {
      setProgress(100);
    } else {
      const totalQuestions = questions.length - 2; // Minus welcome and final screens
      const currentIndex = questionIndex[currentQuestionId] - 1; // -1 because we skip welcome
      setProgress(Math.round((currentIndex / totalQuestions) * 100));
    }
  }, [currentQuestionId]);

  // Calculer les résultats lors du changement des réponses ou des données
  useEffect(() => {
    if (currentQuestionId === 'final') {
      calculateResults();
    }
  }, [currentQuestionId, answers, data]);

  // Gérer les choix de l'utilisateur
  const handleAnswer = (questionId, answer) => {
    const question = questions.find(q => q.id === questionId);
    
    // Mettre à jour les réponses
    setAnswers(prev => {
      const newAnswers = { ...prev };
      
      if (question.multiple) {
        // Pour les questions à choix multiples
        if (!newAnswers[questionId]) {
          newAnswers[questionId] = [];
        }
        
        const index = newAnswers[questionId].indexOf(answer);
        if (index === -1) {
          newAnswers[questionId] = [...newAnswers[questionId], answer];
        } else {
          newAnswers[questionId] = newAnswers[questionId].filter(a => a !== answer);
        }
      } else {
        // Pour les questions à choix unique
        newAnswers[questionId] = answer;
      }
      
      return newAnswers;
    });
  };

  // Navigation vers la question suivante
  const goToNextQuestion = () => {
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    
    // Si on est sur la question du profil et qu'aucun choix n'est fait, bloquer
    if (currentQuestionId === 'user_info' && !answers[currentQuestionId]) {
      // Simple alerte ou message visuel
      alert("Veuillez sélectionner une option pour continuer");
      return;
    }
    
    if (currentQuestion && currentQuestion.nextQuestion) {
      let nextQuestionId;
      
      // Vérifier si nextQuestion est une fonction (navigation conditionnelle)
      if (typeof currentQuestion.nextQuestion === 'function') {
        nextQuestionId = currentQuestion.nextQuestion(answers[currentQuestionId]);
      } else {
        // Navigation simple avec une chaîne
        nextQuestionId = currentQuestion.nextQuestion;
      }
      
      // Si on passe à la page finale à partir de la page d'email, enregistrer les données
      if (currentQuestionId === 'contact_info' && nextQuestionId === 'final') {
        saveUserData();
      }
      
      setCurrentQuestionId(nextQuestionId);
    }
  };

  // Fonction pour enregistrer les données utilisateur dans Firebase
  const saveUserData = async () => {
    try {
      const sessionId = localStorage.getItem('assistant_session_id') || 
                     'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      
      if (!localStorage.getItem('assistant_session_id')) {
        localStorage.setItem('assistant_session_id', sessionId);
      }
      
      await addDoc(collection(db, "users"), {
        sessionId,
        email: answers['email'] || '',
        userType: answers['user_info'] || '',
        timestamp: new Date()
      });
      
      console.log("Données utilisateur enregistrées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données utilisateur:", error);
    }
  };

  // Historique de navigation pour le retour en arrière
  useEffect(() => {
    // Si on change de question, mettre à jour l'historique
    // Mais ne pas stocker la page d'accueil dans l'historique
    if (currentQuestionId !== 'welcome') {
      setNavigationHistory(prev => {
        // Éviter les doublons consécutifs
        if (prev.length > 0 && prev[prev.length - 1] === currentQuestionId) {
          return prev;
        }
        return [...prev, currentQuestionId];
      });
    }
  }, [currentQuestionId]);

  // Navigation vers la question précédente
  const goToPreviousQuestion = () => {
    // Cas spécial pour les questions de localisation
    if (currentQuestionId === 'region_selection') {
      setCurrentQuestionId('location_scope');
      return;
    }
    
    if (currentQuestionId === 'department_selection') {
      setCurrentQuestionId('region_selection');
      return;
    }
    
    // Cas spécial pour la question platform si on vient de location_scope
    if (currentQuestionId === 'platform' && answers['location_scope'] === '1') {
      setCurrentQuestionId('location_scope');
      return;
    }
    
    // Cas spécial: quand on est à la question "clients" après avoir répondu "non" à multiproducer
    if (currentQuestionId === 'clients' && answers['multiproducer'] === 'no') {
      setCurrentQuestionId('multiproducer');
      return;
    }
    
    // Cas spécial: quand on est dans "multiproducer_services", on retourne à "multiproducer"
    if (currentQuestionId === 'multiproducer_services') {
      setCurrentQuestionId('multiproducer');
      return;
    }
    
    // Comportement normal - trouver l'index de la question actuelle
    const currentIndex = questionIndex[currentQuestionId];
    if (currentIndex > 0) {
      // Aller à la question précédente dans l'ordre du tableau
      setCurrentQuestionId(questions[currentIndex - 1].id);
    }
  };

  // Recommencer le questionnaire
  const restart = () => {
    setAnswers({});
    setCurrentQuestionId('welcome');
    setSearchQuery('');
    setShowAllResults(false);
  };

  // Recherche dans les résultats
  const filteredResults = searchQuery 
    ? results.filter(r => 
        r.item.bf_titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.item.bf_descriptiongenerale?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : results;

  // Déterminer quels résultats afficher
  const displayResults = showAllResults ? filteredResults : filteredResults.slice(0, 5);
  
  // Récupérer la question actuelle
  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  // Fonction pour basculer l'affichage d'une description
  const toggleDescription = (index, event) => {
    // Empêcher la propagation de l'événement pour éviter d'ouvrir la carte complète
    if (event) {
      event.stopPropagation();
    }
    
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Fonction pour suivre les clics sur les résultats
  const trackResultClick = async (result, index) => {
    try {
      const sessionId = localStorage.getItem('assistant_session_id');
      if (!sessionId) return;
      
      await addDoc(collection(db, "result_clicks"), {
        sessionId: sessionId,
        platformId: result.item.id_fiche || '',
        platformName: result.item.bf_titre || '',
        position: index + 1,
        matchPercentage: result.matchPercentage,
        timestamp: new Date()
      });
      
      console.log("Clic sur résultat enregistré");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du clic:", error);
    }
  };

// Correction des erreurs dans la fonction calculateResults
// Fonction calculateResults() complète à copier-coller
const calculateResults = async () => {
  if (data.length === 0) {
    setResults([]);
    return;
  }

  // Première étape : filtrer les plateformes selon le critère de localisation
  const filteredData = data.filter(item => {
    // Si l'utilisateur n'a pas spécifié de préférence de localisation, inclure toutes les plateformes
    if (!answers['location_scope']) {
      return true;
    }
    
    const locationScope = answers['location_scope'];
    
    // Si l'utilisateur a choisi France entière, garder toutes les plateformes
    if (locationScope === '1') {
      return true;
    }
    
    // Si l'utilisateur a choisi une restriction géographique
    if (locationScope === '2') {
      const selectedRegions = answers['region_selection'] || [];
      const selectedDepartments = answers['department_selection'] || [];
      
      // Les plateformes France entière sont toujours disponibles
      if (item['listeListeOuinonid_echellelocalisation'] === '1') {
        return true;
      }
      
      // Vérifier correspondance de région ou département
      if (selectedRegions.length > 0 || selectedDepartments.length > 0) {
        // Vérifier correspondance de région
        if (selectedRegions.length > 0) {
          const itemRegions = (item['checkboxListeRegionsid_listeregions'] || '').split(',').map(s => s.trim());
          // Si au moins une région correspond
          for (const regionId of selectedRegions) {
            if (itemRegions.includes(regionId)) {
              return true;
            }
          }
        }
        
        // Vérifier correspondance de département
        if (selectedDepartments.length > 0) {
          const itemDepartments = (item['checkboxListeDepartementsid_listedepartements'] || '').split(',').map(s => s.trim());
          // Si au moins un département correspond
          for (const deptId of selectedDepartments) {
            if (itemDepartments.includes(deptId)) {
              return true;
            }
          }
        }
        
        // Si aucune correspondance géographique, exclure la plateforme
        return false;
      }
      
      // Par défaut, si l'utilisateur a choisi une restriction mais n'a pas sélectionné de régions/départements
      return false;
    }
    
    return true;
  });
  
  // Deuxième étape : calculer le score pour les plateformes qui ont passé le filtre de localisation
  const scoredData = filteredData.map(item => {
    let matchedCriteria = 0;
    let totalCriteria = 0;
    let locationMatch = true; // Par défaut, toutes les plateformes ici ont déjà satisfait le critère de localisation
    
    // Parcourir toutes les autres réponses
 Object.entries(answers).forEach(([questionId, answer]) => {
  // Ignorer les questions de localisation déjà traitées
  if (['location_scope', 'region_selection', 'department_selection'].includes(questionId)) {
    return;
  }
  
  const question = questions.find(q => q.id === questionId);
  if (!question || !question.filter) return;
  
  // Cas spécial pour la question d'ajustement du poids
  if (questionId === 'weight_adjustment') {
    totalCriteria++;
    if (answer) {
      const itemValue = item[question.filter];
      
      // Si la réponse est "yes", vérifier si l'item a une des deux valeurs "oui" (2 ou 3)
      if (answer === 'yes' && (itemValue === '2' || itemValue === '3')) {
        matchedCriteria++;
      }
      // Si la réponse est "no", vérifier si l'item a la valeur "non" (1)
      else if (answer === 'no' && itemValue === '1') {
        matchedCriteria++;
      }
    }
  }
  // Différentes logiques selon le type de filtre
  else if (question.filter === 'listeListeTypeplateforme') {
    // Filtrage pour le type de plateforme (choix unique)
    totalCriteria++;
    if (answer && item[question.filter] === answer) {
      matchedCriteria++;
    }
  } 
  else if (question.filter === 'ouinonFields') {
    // Gestion des champs Oui/Non
    if (Array.isArray(answer) && answer.length > 0) {
      answer.forEach(ans => {
        const fieldName = question.filterMapping[ans];
        totalCriteria++;
        if (fieldName && item[fieldName] === "2") { // "2" = Oui
          matchedCriteria++;
        }
      });
    }
  }
  else {
    // Filtrage pour les autres critères (choix multiples)
    if (Array.isArray(answer) && answer.length > 0) {
      const itemValues = (item[question.filter] || '').split(',').map(s => s.trim());
      
      // Compter chaque valeur sélectionnée comme un critère distinct
      answer.forEach(ans => {
        totalCriteria++;
        if (itemValues.includes(ans)) {
          matchedCriteria++;
        }
      });
    }
  }
});
    
    // Calculer le pourcentage de correspondance
    const matchPercentage = totalCriteria > 0 ? Math.round((matchedCriteria / totalCriteria) * 100) : 0;
    
    return {
      item,
      matchedCriteria,
      totalCriteria,
      matchPercentage,
      locationMatch // Ajouter cette info pour l'affichage
    };
  });
  
  // Trier par pourcentage de correspondance décroissant
  const sortedResults = scoredData
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
  
  setResults(sortedResults);
  
  // Enregistrer les résultats dans Firebase
  try {
    // Générer un ID de session unique si pas déjà existant
    const sessionId = localStorage.getItem('assistant_session_id') || 
                     'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    if (!localStorage.getItem('assistant_session_id')) {
      localStorage.setItem('assistant_session_id', sessionId);
    }
    
    // Enregistrer les critères de recherche
    await addDoc(collection(db, "search_criteria"), {
      sessionId: sessionId,
      criteria: answers,
      timestamp: new Date()
    });
    
    // Enregistrer les résultats affichés
    await addDoc(collection(db, "search_results"), {
      sessionId: sessionId,
      results: sortedResults.slice(0, 10).map((r, idx) => ({
        platformId: r.item.id_fiche || '',
        platformName: r.item.bf_titre || '',
        position: idx + 1,
        matchPercentage: r.matchPercentage,
        locationMatch: r.locationMatch
      })),
      timestamp: new Date()
    });
    
    console.log("Résultats enregistrés avec succès");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des résultats:", error);
  }
};


  // Rendu du composant
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
      {/* En-tête */}
      <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
            Assistant de sélection d'outils de vente en ligne
          </h1>
          
          {/* Barre de progression */}
          {currentQuestionId !== 'welcome' && (
            <div className="hidden sm:block w-1/2">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                {progress}% complété
              </div>
            </div>
          )}
          
          {/* Bouton de redémarrage (visible après la première question) */}
          {currentQuestionId !== 'welcome' && (
            <button 
              onClick={restart}
              className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={16} className="mr-1" /> Recommencer
            </button>
          )}
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Chargement des données...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 md:p-8 max-w-4xl mx-auto transition-all duration-300 min-h-[400px]">
            {/* Écran d'accueil */}
            {currentQuestion.type === 'welcome' && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">
                  {currentQuestion.title}
                </h2>
                <p className="text-lg mb-6">{currentQuestion.description}</p>
                
                <img 
                  src="/images/accueil.jpg"
                  alt="Agriculture durable" 
                  className="mx-auto rounded-lg shadow-md mb-6"
                />
                
                {/* Message RGPD */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6 text-left max-w-2xl mx-auto">
                  <div className="flex">
                    <HelpCircle size={20} className="text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-semibold mb-2">Protection de vos données</p>
                      <p>
                        En utilisant cet assistant, vos choix seront enregistrés de manière anonyme pour améliorer notre service. 
                        Si vous fournissez votre email, nous l'utiliserons uniquement pour vous informer des mises à jour. 
                        Vos données ne seront jamais partagées avec des tiers.
                      </p>
                      <p className="mt-2">
                        <a href="/privacy" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">
                          En savoir plus sur notre politique de confidentialité
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={goToNextQuestion}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto text-lg font-semibold"
                >
                  J'accepte et je commence <ArrowRight size={20} className="ml-2" />
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  En cliquant sur ce bouton, vous acceptez notre collecte de données anonymisées
                </p>
              </div>
            )}

            {currentQuestion.type === 'geographic_selector' && (
              <RegionDepartmentSelector 
                onComplete={(data) => {
                  if (data.cancel) {
                    // Si l'utilisateur annule, revenir à la question précédente
                    goToPreviousQuestion();
                  } else {
                    // Sauvegarder les données et passer à la question suivante
                    setAnswers(prev => ({
                      ...prev,
                      'region_selection': data.selectedRegions,
                      'department_selection': data.selectedDepartements
                    }));
                    goToNextQuestion();
                  }
                }}
                initialData={{
                  selectedRegions: answers['region_selection'] || [],
                  selectedDepartements: answers['department_selection'] || []
                }}
              />
            )}
            
            {/* Questions à choix */}
            {currentQuestion.type === 'choice' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">{currentQuestion.title}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300 italic">{currentQuestion.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Options de réponses avec gestion des choix dynamiques pour les départements */}
                  {currentQuestionId === 'department_selection' 
                    ? departmentChoices.map(choice => {
                        const isSelected = currentQuestion.multiple 
                          ? answers[currentQuestionId]?.includes(choice.id)
                          : answers[currentQuestionId] === choice.id;
                          
                        return (
                          <div 
                            key={choice.id}
                            onClick={() => handleAnswer(currentQuestionId, choice.id)}
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-600 shadow-md' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-start">
                              {choice.icon && (
                                <span className="text-2xl mr-3">{choice.icon}</span>
                              )}
                              
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg flex items-center">
                                  {choice.label}
                                  {isSelected && (
                                    <CheckCircle size={18} className="ml-2 text-green-500" />
                                  )}
                                </h3>
                                {choice.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{choice.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : currentQuestion.choices.map(choice => {
                        const isSelected = currentQuestion.multiple 
                          ? answers[currentQuestionId]?.includes(choice.id)
                          : answers[currentQuestionId] === choice.id;
                          
                        return (
                          <div 
                            key={choice.id}
                            onClick={() => handleAnswer(currentQuestionId, choice.id)}
                            className={`border p-4 rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-600 shadow-md' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-start">
                              {choice.icon && (
                                <span className="text-2xl mr-3">{choice.icon}</span>
                              )}
                              
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg flex items-center">
                                  {choice.label}
                                  {isSelected && (
                                    <CheckCircle size={18} className="ml-2 text-green-500" />
                                  )}
                                </h3>
                                {choice.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{choice.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  }

                  {/* Option "Je ne sais pas" - maintenant dans la même grille */}
                  <div 
                    onClick={() => goToNextQuestion()}
                    className="border p-4 rounded-lg cursor-pointer transition-all border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-start">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-gray-500 dark:text-gray-400">Je ne sais pas</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Je ne suis pas sûr ou cela m'est égal</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message pour rassurer l'utilisateur */}
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-8 mb-4 text-center">
                  Vous pouvez passer cette question si vous n'avez pas de préférence particulière.
                </p>
                
                {/* Boutons de navigation */}
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={goToPreviousQuestion}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Précédent
                  </button>
                  
                  <button 
                    onClick={goToNextQuestion}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    {currentQuestion.nextQuestion === 'final' ? 'Voir les résultats' : 'Suivant'} <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Question pour collecter l'email */}
            {currentQuestion.type === 'email' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">{currentQuestion.title}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300 italic">{currentQuestion.description}</p>
                
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Votre adresse email (optionnel)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600"
                    value={answers['email'] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                {/* Boutons de navigation */}
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={goToPreviousQuestion}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <ArrowLeft size={18} className="mr-2" /> Précédent
                  </button>
                  
                  <button 
                    onClick={goToNextQuestion}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    Voir les résultats <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Écran de résultats */}
            {currentQuestion.type === 'results' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">{currentQuestion.title}</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{currentQuestion.description}</p>
                
                {/* Recherche dans les résultats */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher parmi les résultats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600"
                  />
                </div>
                
                {/* Affichage des résultats */}
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-lg mb-4">Aucun résultat ne correspond à vos critères.</p>
                    <button 
                      onClick={restart}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
                    >
                      <RefreshCw size={18} className="mr-2" /> Modifier vos critères
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-gray-600 dark:text-gray-300">
                      {filteredResults.length} résultats trouvés
                    </div>
                    
                    <div className="space-y-4">
                      {displayResults.map((result, index) => (
                        <div 
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4 flex flex-col md:flex-row">
                            {/* Logo et score */}
                            <div className="flex flex-col items-center md:w-1/4 mb-4 md:mb-0">
                              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mb-2">
                                {result.item.imagebf_image ? (
                                  <img 
                                    src={`https://www.oad-venteenligne.org/cache/vignette_${result.item.imagebf_image}`}
                                    alt={result.item.bf_titre || 'Logo'}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <img 
                                    src="/api/placeholder/100/100" 
                                    alt="Logo par défaut"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                )}
                              </div>
                              <div className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm font-bold text-green-800 dark:text-green-200">
                                {Math.round(result.matchPercentage)}% de correspondance
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {platformTypes[result.item.listeListeTypeplateforme] || 'Type inconnu'}
                              </div>
                              
                              {/* Indicateur de localisation */}
                              {answers['location_scope'] === '2' && (
                                <div className={`text-xs mt-2 px-2 py-1 rounded-full ${result.locationMatch ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                  {result.locationMatch ? 'Disponible dans votre région' : 'Disponibilité locale limitée'}
                                </div>
                              )}
                            </div>
                            
                            {/* Détails */}
                            <div className="md:w-3/4 md:pl-4">
                              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                                {result.item.bf_titre || 'Sans titre'}
                              </h3>
                              <div className="mb-3">
                                <p className={`text-gray-600 dark:text-gray-300 ${!expandedDescriptions[index] ? 'line-clamp-2' : ''}`}>
                                  {result.item.bf_descriptiongenerale || 'Aucune description disponible'}
                                </p>
                                <button 
                                  onClick={(e) => toggleDescription(index, e)}
                                  className="text-green-600 dark:text-green-400 mt-1 flex items-center text-sm font-medium hover:underline"
                                >
                                  {expandedDescriptions[index] ? 'Voir moins' : 'Voir plus'} 
                                  <span className="ml-1 text-lg font-bold">{expandedDescriptions[index] ? '−' : '+'}</span>
                                </button>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {/* Affichage des tags indiquant pourquoi cet outil correspond */}
                                {result.item.checkboxListeProduitcommercialiseid_produitscommercialises?.split(',').map(id => {
                                  const product = {
                                    '1': { icon: '🥕', name: 'Fruits et légumes' },
                                    '2': { icon: '🥫', name: 'Produits d\'épicerie' },
                                    '3': { icon: '🥩', name: 'Produits carnés' },
                                    '4': { icon: '🐟', name: 'Produits de la pêche' },
                                    '5': { icon: '🧀', name: 'Produits laitiers' },
                                    '6': { icon: '🛍️', name: 'Produits non alimentaires' }
                                  }[id.trim()];
                                  
                                  if (product) {
                                    return (
                                      <span key={id} className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                                        <span className="mr-1">{product.icon}</span>
                                        {product.name}
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                                
                                {/* Affichage de la couverture géographique si pertinent */}
                                {result.item['listeListeOuinonid_echellelocalisation'] === '1' && (
                                  <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                                    <span className="mr-1">🇫🇷</span>
                                    France entière
                                  </span>
                                )}
                                
                                {/* Affichage des régions si l'information est disponible */}
                                {result.item.checkboxListeRegionsid_listeregions?.split(',').map(id => {
                                  const regionName = questions.find(q => q.id === 'region_selection')?.choices.find(c => c.id === id.trim())?.label;
                                  if (regionName) {
                                    return (
                                      <span key={id} className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                                        <span className="mr-1">📍</span>
                                        {regionName}
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                              
                              <div className="flex flex-wrap justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                  Mise en ligne: {getYearFromNumber(result.item.listeListeAnneeDeMiseEnLigne)}
                                </span>
                                
                                <a 
                                  href={result.item.bf_urloutil || `https://www.oad-venteenligne.org/?${result.item.id_fiche}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={() => trackResultClick(result, index)}
                                  className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline mt-2"
                                >
                                  Site Web de l'outil <ExternalLink size={14} className="ml-1" />
                                </a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Pourquoi cet outil ? Section pliable/dépliable */}
                          <details className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                            <summary className="py-2 px-4 cursor-pointer font-semibold">
                              Correspondance avec vos critères
                            </summary>
                            <div className="p-4 text-sm">
                              {/* Section spéciale pour afficher la correspondance géographique */}
                              {answers['location_scope'] === '2' && (
                                <div className="mb-4">
                                  <h4 className="font-medium mb-2">Localisation</h4>
                                  <div>
                                    {result.locationMatch ? (
                                      <p className="text-green-600 dark:text-green-400 flex items-center">
                                        <CheckCircle size={16} className="mr-2" />
                                        Cette plateforme est disponible dans votre zone géographique
                                      </p>
                                    ) : (
                                      <p className="text-yellow-600 dark:text-yellow-400 flex items-center">
                                        <HelpCircle size={16} className="mr-2" />
                                        Cette plateforme a une couverture géographique limitée qui pourrait ne pas inclure votre zone
                                      </p>
                                    )}
                                    
                                    {/* Détails de la couverture */}
                                    <div className="mt-2 pl-5">
                                      {result.item['listeListeOuinonid_echellelocalisation'] === '1' && (
                                        <p className="text-gray-600 dark:text-gray-300">Disponible dans toute la France</p>
                                      )}
                                      
                                      {result.item.checkboxListeRegionsid_listeregions && (
                                        <div>
                                          <p className="font-medium mt-1">Régions couvertes:</p>
                                          <ul className="list-disc pl-5">
                                            {result.item.checkboxListeRegionsid_listeregions.split(',').map(id => {
                                              const regionName = questions.find(q => q.id === 'region_selection')?.choices.find(c => c.id === id.trim())?.label;
                                              return regionName ? <li key={id}>{regionName}</li> : null;
                                            })}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {result.item.checkboxListeDepartementsid_listedepartements && (
                                        <div>
                                          <p className="font-medium mt-1">Départements couverts:</p>
                                          <p className="text-gray-600 dark:text-gray-300">
                                            {result.item.checkboxListeDepartementsid_listedepartements}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Autres critères de correspondance */}
                              {Object.entries(answers).map(([questionId, answer]) => {
                                // Ignorer les questions de localisation qui sont traitées séparément ci-dessus
                                if (['location_scope', 'region_selection', 'department_selection'].includes(questionId)) {
                                  return null;
                                }
                                
                                const question = questions.find(q => q.id === questionId);
                                if (!question || !question.filter) return null;
                                
                                // Pour chaque question, nous allons collecter les critères qui correspondent et ceux qui ne correspondent pas
                                const matchingCriteria = [];
                                const nonMatchingCriteria = [];
                                
                                // Cas spécial pour la question d'ajustement du poids
                                if (questionId === 'weight_adjustment') {
                                  const itemValue = result.item[question.filter];
                                  
                                  // Si la réponse est "yes" (utilisateur veut ajuster le poids)
                                  if (answer === 'yes') {
                                    // Vérifier si l'outil propose l'ajustement (valeur 2 ou 3)
                                    if (itemValue === '2' || itemValue === '3') {
                                      // Déterminer quel type d'ajustement est proposé
                                      const adjustmentType = itemValue === '2' 
                                        ? "avec création d'avoir" 
                                        : "avec ajustement automatique du prix";
                                      
                                      matchingCriteria.push(`Ajustement du poids ${adjustmentType}`);
                                    } else {
                                      nonMatchingCriteria.push("Ajustement du poids");
                                    }
                                  } 
                                  // Si la réponse est "no" (utilisateur ne veut pas ajuster le poids)
                                  else if (answer === 'no') {
                                    if (itemValue === '1') {
                                      matchingCriteria.push("Pas d'ajustement du poids");
                                    } else {
                                      nonMatchingCriteria.push("Pas d'ajustement du poids");
                                    }
                                  }
                                }
                                else if (question.filter === 'listeListeTypeplateforme') {
                                  if (answer && result.item[question.filter] === answer) {
                                    const choiceLabel = question.choices.find(c => c.id === answer)?.label;
                                    matchingCriteria.push(`Type d'outil: ${choiceLabel}`);
                                  } else if (answer) {
                                    const choiceLabel = question.choices.find(c => c.id === answer)?.label;
                                    nonMatchingCriteria.push(`Type d'outil: ${choiceLabel}`);
                                  }
                                } 
                                else if (question.filter === 'ouinonFields') {
                                  if (Array.isArray(answer) && answer.length > 0) {
                                    answer.forEach(ans => {
                                      const fieldName = question.filterMapping[ans];
                                      const featureLabel = question.choices.find(c => c.id === ans)?.label;
                                      
                                      if (fieldName && result.item[fieldName] === "2") { // "2" = Oui
                                        matchingCriteria.push(featureLabel);
                                      } else if (fieldName) {
                                        nonMatchingCriteria.push(featureLabel);
                                      }
                                    });
                                  }
                                }
                                else {
                                  if (Array.isArray(answer) && answer.length > 0) {
                                    const itemValues = (result.item[question.filter] || '').split(',').map(s => s.trim());
                                    
                                    answer.forEach(ans => {
                                      const choiceLabel = question.choices.find(c => c.id === ans)?.label;
                                      
                                      if (itemValues.includes(ans)) {
                                        matchingCriteria.push(choiceLabel);
                                      } else {
                                        nonMatchingCriteria.push(choiceLabel);
                                      }
                                    });
                                  }
                                }
                                
                                // N'afficher la section que si nous avons des critères à montrer
                                if (matchingCriteria.length === 0 && nonMatchingCriteria.length === 0) {
                                  return null;
                                }
                                
                                return (
                                  <div key={questionId} className="mb-4">
                                    <h4 className="font-medium mb-2">{question.title.replace('?', '')}</h4>
                                    
                                    {matchingCriteria.length > 0 && (
                                      <div className="mb-2">
                                        <h5 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Critères correspondants</h5>
                                        <ul className="space-y-1">
                                          {matchingCriteria.map((text, idx) => (
                                            <li key={idx} className="flex items-start text-green-600 dark:text-green-400">
                                              <CheckCircle size={16} className="mr-2 shrink-0 mt-0.5" />
                                              <span>{text}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {nonMatchingCriteria.length > 0 && (
                                      <div>
                                        <h5 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Critères non correspondants</h5>
                                        <ul className="space-y-1">
                                          {nonMatchingCriteria.map((text, idx) => (
                                            <li key={idx} className="flex items-start text-gray-500 dark:text-gray-400">
                                              <span className="mr-2 mt-0.5 shrink-0">✕</span>
                                              <span className="line-through">{text}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bouton pour voir plus de résultats */}
                    {!showAllResults && filteredResults.length > 5 && (
                      <button 
                        onClick={() => setShowAllResults(true)}
                        className="w-full mt-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Voir tous les résultats ({filteredResults.length})
                      </button>
                    )}
                  </>
                )}
                
                 {/* Bouton pour recommencer */}
                <div className="mt-8 text-center">
                  <button 
                    onClick={restart}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
                  >
                    <RefreshCw size={18} className="mr-2" /> Recommencer avec de nouveaux critères
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Pied de page */}
      <footer className="bg-white dark:bg-gray-800 shadow-md mt-8 py-4">
        <div className="container mx-auto">
          {/* Texte existant */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p>Assistant de sélection pour les plateformes de vente en ligne pour produits agricoles</p>
            <p className="mt-2">
              <a href="/" className="text-green-600 dark:text-green-400 hover:underline">
                Retour au site principal
              </a>
            </p>
          </div>
          
          {/* Nouvelle section pour les logos */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mb-3">
              Un projet porté par
            </p>
            <div className="flex justify-center items-center flex-wrap gap-6 sm:gap-10 px-4">
              {/* Logo container avec dimensions uniformes */}
              <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center">
                <img 
                  src="/images/rmtal.svg" 
                  alt="RMT Alimentation locale" 
                  className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
              <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center">
                <img 
                  src="/images/inrae.svg" 
                  alt="INRAE" 
                  className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
              <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center">
                <img 
                  src="/images/cda_carre.png" 
                  alt="Chambres d'Agriculture"
                  className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
              <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center">
                <img 
                  src="/images/off.svg" 
                  alt="OFF" 
                  className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity" 
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Assistant;
