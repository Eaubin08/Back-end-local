import { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Terminal, 
  Activity, 
  Shield, 
  Search, 
  FileText, 
  Play, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Database,
  Cpu,
  Menu,
  X,
  Globe,
  BookOpen,
  Share2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}


export default function App() {
  const [explorer, setExplorer] = useState<FileNode[]>([]);
  const [systemTree, setSystemTree] = useState<FileNode[]>([]);
  const [viewMode, setViewMode] = useState<'files' | 'system' | 'specs'>('system');
  const [status, setStatus] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('os0_kernel');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);
  const [inputRisk, setInputRisk] = useState(0.5);
  const [inputUncertainty, setInputUncertainty] = useState(0.3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string, name: string, content: string, isSystem?: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [activeSpecContent, setActiveSpecContent] = useState<string | null>(null);

  const TABS = [
    { id: 'os0_kernel', label: 'OS0 KERNEL', icon: Shield },
    { id: 'os0_grammar', label: 'GRAMMAR', icon: BookOpen },
    { id: 'os0_constitution', label: 'CONSTITUTION', icon: Shield },
    { id: 'os1_reflex', label: 'OS1 REFLEX', icon: Activity },
    { id: 'os1_needs', label: 'NEEDS', icon: AlertTriangle },
    { id: 'os2_quantum', label: 'OS2 QUANTUM', icon: Cpu },
    { id: 'os2_knowledge', label: 'KNOWLEDGE', icon: Database },
    { id: 'os3_world', label: 'OS3 WORLD', icon: Globe },
    { id: 'sigma', label: 'SIGMA', icon: Share2 },
    { id: 'gps', label: 'GPS', icon: Globe },
    { id: 'os4_proof', label: 'OS4 PROOF', icon: Clock },
    { id: 'os5_foundations', label: 'OS5 FOUNDATIONS', icon: Database },
    { id: 'becoming', label: 'BECOMING', icon: Play },
    { id: 'extensions', label: 'EXTENSIONS', icon: Share2 },
    { id: 'operator', label: 'OPERATOR', icon: Terminal },
    { id: 'specs', label: 'SPECS', icon: FileText },
    { id: 'canonical_forms', label: 'FORMS', icon: BookOpen },
    { id: 'editor', label: 'VIEWER', icon: Terminal },
  ];

  useEffect(() => {
    fetchExplorer();
    fetchSystem();
    fetchStatus();
    fetchAudit();
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchAudit = async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setLogs(data.logs.reverse());
    } catch (e) {
      console.error('Audit fetch failed', e);
    }
  };

  useEffect(() => {
    const fetchActiveSpec = async () => {
      const specTabs = ['sigma', 'gps', 'becoming', 'extensions', 'operator', 'canonical_forms'];
      if (activeTab.startsWith('os') || specTabs.includes(activeTab)) {
        try {
          const path = `specs/${activeTab}/manifest.md`;
          const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
          if (res.ok) {
            const data = await res.json();
            setActiveSpecContent(data.content);
          } else {
            setActiveSpecContent(null);
          }
        } catch (e) {
          console.error('Failed to fetch spec', e);
          setActiveSpecContent(null);
        }
      } else {
        setActiveSpecContent(null);
      }
    };
    fetchActiveSpec();
  }, [activeTab]);

  const fetchExplorer = async () => {
    try {
      const res = await fetch('/api/explorer');
      const data = await res.json();
      console.log('Explorer Data:', data);
      setExplorer(data);
    } catch (e) {
      console.error('Explorer fetch failed', e);
    }
  };

  const fetchSystem = async () => {
    try {
      const res = await fetch('/api/system');
      const data = await res.json();
      setSystemTree(data);
    } catch (e) {
      console.error('System fetch failed', e);
    }
  };

  const fetchFile = async (path: string, name: string) => {
    if (path.startsWith('system/')) {
      // Handle virtual system nodes
      const doc = getSystemDoc(path);
      setSelectedFile({ path, name, content: doc, isSystem: true });
      setActiveTab('editor');
      return;
    }
    try {
      const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setSelectedFile({ path, name, content: data.content, isSystem: false });
      setActiveTab('editor');
    } catch (e) {
      console.error('File fetch failed', e);
    }
  };

  const getSystemDoc = (path: string) => {
    const docs: Record<string, string> = {
      'system/os0/decision': `OS0 KERNEL: KERNEL ARBITRE (SOUVERAIN)
========================================

Role: Arbitre ultime, détenteur de la décision ex ante.
Logic: Évalue le couple Risque/Incertitude pour produire un verdict souverain.
Canonical: OS0-CANONICAL-DECISION-TICKET

Fonctionnalités:
- Décision ex ante: Arbitrage avant exécution.
- Signature Souveraine: Chaque décision est signée cryptographiquement.
- Priorité Absolue: Le Kernel peut interrompre n'importe quel processus.

Spécifications:
- Latence: < 1ms (Temps de réponse critique)
- Intégrité: 100% Sovereign (Isolation totale)
- Audit: OS4-TRACE-ENABLED (Traçabilité complète)`,

      'system/os0/ingest': `OS0 KERNEL: LAYER A SCREENING (SÉCURITÉ)
=========================================

Role: Premier cercle de sécurité, sas de screening avant le Kernel.
Channel: Surface Opératoire (Canal d'entrée privilégié)
Canonical: OS0-CANONICAL-INGEST-PROTOCOL

Fonctionnalités:
- Screening: Filtrage des données brutes selon des schémas stricts.
- Normalisation: Transformation des entrées en Objets Canoniques.
- Isolation: Empêche les injections directes vers le Kernel.

Spécifications:
- Throughput: 10k events/s
- Validation: Strict Schema (Zod-based)`,

      'system/os0/grammar': `OS0 KERNEL: GRAMMAIRE SYSTÈME (CONSTITUTION)
==============================================

Role: Définit les règles de circulation de l'information entre les OS.
Canonical: OS0-CANONICAL-GRAMMAR-SPEC

Principes:
- Constitution inter-couches: Règles de transit immuables.
- Objets: Définition typée de tout ce qui existe dans le système.
- Statuts / Transitions: Les seuls états autorisés et leurs chemins critiques.
- Triggers / Exceptions: Déclencheurs automatiques et protocoles d'erreur.`,

      'system/os0/constitution': `OS0 KERNEL: CONSTITUTION INTER-COUCHES
=======================================

Role: Charte fondamentale régissant les interactions entre les couches OS.
Logic: Définit les protocoles de communication et les limites de souveraineté.
Status: IMMUTABLE`,

      'system/os1/canon': `OS1 ENTRÉE: CANONISATION DU RÉEL
================================

Role: Transformation du brut en données structurées admissibles.
Canonical: OS1-CANONICAL-CANON-ENGINE

Logic:
- Capture du Réel: Ingestion via capteurs, API, ou fichiers.
- Typage Canonique: Attribution d'une forme souveraine (ex: SovereignObject).
- Sanity Check: Vérification de la cohérence sémantique avant traitement.`,

      'system/os1/needs': `OS1 ENTRÉE: NEEDS ENGINE (BESOINS)
==================================

Role: Identifie les besoins système en temps réel.
Priority: High
Canonical: OS1-CANONICAL-NEEDS-ENGINE

Logic:
- Analyse d'Intention: Détecte ce que le système "doit" faire.
- Qualification: Priorise les besoins pour le Kernel.
- Feedback Loop: Ajuste les priorités selon l'état du système.`,

      'system/os1/reflex': `OS1 ENTRÉE: REFLEX ZONE (RÉFLEXES)
==================================

Role: Réponse immédiate aux patterns connus (Sécurité Active).
Latency: < 0.1ms
Canonical: OS1-CANONICAL-REFLEX-ZONE

Logic:
- Pattern Matching: Reconnaissance instantanée de menaces (DDoS, SQLi).
- Action Directe: Bypasse le Kernel pour les actions de protection vitale.
- Alerte Critique: Notifie OS4 de tout réflexe déclenché.`,

      'system/os1/upstream': `OS1 REFLEX: UPSTREAM CONNECTORS
===============================

Role: Gestion des flux ascendants vers les couches supérieures.
Logic: Agrégation et transmission des données canonisées.
Status: CONNECTED`,

      'system/os2/knowledge': `OS2 RECHERCHE: KNOWLEDGE GRAPH (MÉMOIRE)
========================================

Role: Cartographie sémantique des concepts du système.
Canonical: OS2-CANONICAL-KNOWLEDGE-GRAPH

Logic:
- Graphe de Souveraineté: Relie les objets, les décisions et les acteurs.
- Inférence: Déduit de nouvelles relations à partir des données existantes.
- Persistance: Stocké de manière optimisée pour la recherche vectorielle.`,

      'system/os2/search': `OS2 RECHERCHE: SEARCH ENGINE (VECTEUR)
=======================================

Role: Indexation et recherche locale de la matière canonique.
Canonical: OS2-CANONICAL-SEARCH-ENGINE

Logic:
- Recherche Vectorielle: Trouve des similarités sémantiques.
- Indexation Temps Réel: Les nouveaux objets sont indexés instantanément.
- Performance: Optimisé pour des recherches sur des millions d'objets.`,

      'system/os2/quantum': `OS2 QUANTUM: QUANTUM RESEARCH
==============================

Role: Exploration des états superposés et des probabilités.
Logic: Moteur d'incertitude contrôlée.
Status: STABLE`,

      'system/os3/ui': `OS3 MONDE: INTERFACE LOGIC (PILOTAGE)
=======================================

Role: Orchestre la représentation visuelle du Monolithe.
Canonical: OS3-CANONICAL-UI-LOGIC

Logic:
- Télémétrie: Affiche l'état interne en temps réel.
- Pilotage: Permet à l'administrateur d'interagir avec les moteurs.
- Responsive: Adapté aux terminaux mobiles et industriels.`,

      'system/os3/connectors': `OS3 MONDE: EXTERNAL CONNECTORS (PONTS)
========================================

Role: Ponts sécurisés vers les systèmes externes.
Canonical: OS3-CANONICAL-CONNECTORS

Logic:
- Isolation I/O: Tout échange externe passe par un connecteur typé.
- Protocoles: Supporte FS, Web, Blockchain, IPFS.
- Sécurité: Chiffrement de bout en bout des flux de données.`,

      'system/os3/alignment': `OS3 SIGMA: WORLD STATE ALIGNMENT
=================================

Role: Synchronisation de l'état interne avec la réalité externe.
Logic: Consensus et validation de l'état du monde.
Status: ALIGNED`,

      'system/sigma/prediction': `SIGMA: TRAJECTORY PREDICTION
=============================

Role: Calcul des trajectoires futures du système.
Logic: Moteur de prédiction probabiliste.
Status: CALCULATING`,

      'system/sigma/becoming': `SIGMA: BECOMING ENGINE
=======================

Role: Gestion du passage de l'état actuel à l'état futur.
Logic: Transition continue et souveraine.
Status: EVOLVING`,

      'system/sigma/mapping': `SIGMA: FUTURE STATE MAPPING
============================

Role: Cartographie des états possibles à venir.
Logic: Visualisation des trajectoires de devenir.
Status: MAPPED`,

      'system/gps/spatial': `GPS: SPATIAL SOVEREIGNTY
=========================

Role: Définition de la souveraineté dans l'espace physique/virtuel.
Logic: Coordonnées souveraines et limites territoriales.
Status: LOCKED`,

      'system/gps/geofence': `GPS: GEOFENCING LOGIC
=======================

Role: Barrières virtuelles et protocoles de proximité.
Logic: Déclencheurs basés sur la localisation.
Status: ACTIVE`,

      'system/gps/context': `GPS: LOCAL CONTEXT MAPPING
============================

Role: Intégration du contexte local dans la décision.
Logic: Analyse de l'environnement immédiat.
Status: MAPPED`,

      'system/os4/trace': `OS4 PREUVE: TRACEABILITY (AUDIT)
=================================

Role: Log d'audit immuable de toutes les décisions.
Storage: OS5-FOUNDATIONS-SECURE
Canonical: OS4-CANONICAL-TRACE-LOG

Logic:
- Immuabilité: Les logs ne peuvent être ni modifiés ni supprimés.
- Chaînage: Chaque log est lié au précédent (Hash chain).
- Consultation: Interface dédiée pour l'audit souverain.`,

      'system/os4/verify': `OS4 PREUVE: VERIFICATION (PREUVE)
=================================

Role: Preuve formelle de l'intégrité du système.
Canonical: OS4-CANONICAL-VERIFY-ENGINE

Logic:
- Vérification d'État: Compare l'état actuel aux spécifications canoniques.
- Alerte d'Intégrité: Déclenche un arrêt d'urgence si une déviation est détectée.
- Rapport de Conformité: Génère des preuves de souveraineté.`,

      'system/os4/proof': `OS4 PROOF: PROOF OF SOVEREIGNTY
=================================

Role: Génération du certificat de souveraineté final.
Logic: Synthèse des preuves OS0-OS3.
Status: CERTIFIED`,

      'system/os5/storage': `OS5 FONDATIONS: STORAGE ENGINE (PERSISTANCE)
=============================================

Role: Persistance des données de bas niveau.
Integrity: Blocs signés cryptographiquement.
Canonical: OS5-CANONICAL-STORAGE-ENGINE

Logic:
- Stockage Local: Optimisé pour le Monolithe.
- Redondance: Mécanismes de récupération en cas de crash.
- Chiffrement: Données au repos chiffrées par défaut.`,

      'system/os5/idp': `OS5 FONDATIONS: IDENTITY PROVIDER (IDENTITÉ)
==============================================

Role: Gestion de l'identité souveraine.
Canonical: OS5-CANONICAL-IDP-SERVICE

Logic:
- Auth Souveraine: Gestion des accès administrateur.
- Preuve d'Identité: Certificats pour les entités du système.
- Contrôle d'Accès: RBAC (Role Based Access Control) strict.`,

      'system/os5/hal': `OS5 FOUNDATIONS: HARDWARE ABSTRACTION
======================================

Role: Interface avec le matériel physique.
Logic: Pilotes souverains et isolation hardware.
Status: ISOLATED`,
    };
    return docs[path] || `DOCUMENTATION FOR ${path.toUpperCase()}\n\nThis module is part of the Obsidia Sovereign Monolith.\nIt ensures the integrity and performance of the system layers.`;
  };

  const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes;
    return nodes.reduce((acc: FileNode[], node) => {
      const matches = node.name.toLowerCase().includes(query.toLowerCase());
      const children = node.children ? filterNodes(node.children, query) : [];
      if (matches || children.length > 0) {
        acc.push({ ...node, children: children.length > 0 ? children : undefined });
      }
      return acc;
    }, []);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Status fetch failed', e);
    }
  };

  const handleIngest = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risk: inputRisk,
          uncertainty: inputUncertainty
        })
      });
      const data = await res.json();
      setLogs(prev => [data.ticket, ...prev]);
      fetchStatus();
    } catch (e) {
      console.error('Ingest failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#d1d1d1] font-mono overflow-hidden relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0f0f0f] border-b border-[#1a1a1a] flex items-center justify-between px-4 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-orange-500 hover:bg-[#1a1a1a] rounded transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">Obsidia OS</span>
        </div>
        <button onClick={() => setIsTelemetryOpen(!isTelemetryOpen)} className="p-2 text-orange-500 hover:bg-[#1a1a1a] rounded transition-colors">
          <Activity className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar: Explorer */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 border-r border-[#1a1a1a] flex flex-col bg-[#0d0d0d] transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0f0f0f]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Obsidia OS</span>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setViewMode('system')} 
              className={`p-1.5 rounded transition-colors ${viewMode === 'system' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-600 hover:bg-[#1a1a1a]'}`}
              title="System Architecture"
            >
              <Cpu className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('files')} 
              className={`p-1.5 rounded transition-colors ${viewMode === 'files' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-600 hover:bg-[#1a1a1a]'}`}
              title="File System"
            >
              <FolderTree className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setViewMode('specs')} 
              className={`p-1.5 rounded transition-colors ${viewMode === 'specs' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-600 hover:bg-[#1a1a1a]'}`}
              title="Canonical Specs"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          <div className="mb-4 px-2 space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
              <input 
                type="text"
                placeholder="SEARCH_MONOLITH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151515] border border-[#1a1a1a] rounded py-1.5 pl-7 pr-2 text-[10px] focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-gray-700"
              />
            </div>
            <span className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em] block">
              {viewMode === 'system' ? 'Canonical Layers' : viewMode === 'specs' ? 'System Specs' : 'Monolith Files'}
            </span>
          </div>
          <ExplorerTree 
            nodes={filterNodes(
              viewMode === 'system' ? systemTree : 
              viewMode === 'specs' ? (explorer.find(n => n.name === 'specs')?.children || []) : 
              explorer, 
              searchQuery
            )} 
            onFileClick={(p, n) => { fetchFile(p, n); setIsSidebarOpen(false); }} 
          />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col pt-14 lg:pt-0">
        {/* Tabs */}
        <div className="flex bg-[#0f0f0f] border-b border-[#1a1a1a] overflow-x-auto no-scrollbar scroll-smooth">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                activeTab === tab.id 
                ? 'bg-[#1a1a1a] text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-500 hover:bg-[#151515]'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.id === 'editor' ? (selectedFile?.name || 'VIEWER') : tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'os0_kernel' && (
              <motion.div
                key="os0_kernel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-4 lg:p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Shield className="w-4 h-4" /> Kernel Test Bench
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                          <span className="text-gray-500">Risk Factor</span>
                          <span className="text-orange-400 font-bold">{(inputRisk * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="1" step="0.01" 
                          value={inputRisk}
                          onChange={(e) => setInputRisk(parseFloat(e.target.value))}
                          className="w-full h-1 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                          <span className="text-gray-500">Uncertainty</span>
                          <span className="text-orange-400 font-bold">{(inputUncertainty * 100).toFixed(0)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="1" step="0.01" 
                          value={inputUncertainty}
                          onChange={(e) => setInputUncertainty(parseFloat(e.target.value))}
                          className="w-full h-1 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>
                      <button 
                        onClick={handleIngest}
                        disabled={isProcessing}
                        className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
                      >
                        {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Execute Ingest
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#111] border border-[#1a1a1a] p-4 lg:p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Terminal className="w-4 h-4" /> Kernel Logic
                    </h3>
                    <div className="text-[11px] text-gray-400 space-y-4 leading-relaxed">
                      <div className="p-3 bg-[#151515] border-l-2 border-orange-500 rounded-r">
                        <p className="text-orange-400 font-bold uppercase tracking-widest text-[9px]">Priority Matrix</p>
                        <p className="text-[10px]">BLOCK &gt; HOLD &gt; ALLOW</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <p>If risk &gt; 0.8: <span className="text-red-500 font-bold">BLOCK</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                          <p>If uncertainty &gt; 0.5: <span className="text-yellow-500 font-bold">HOLD</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <p>Otherwise: <span className="text-green-500 font-bold">ALLOW</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-[#1a1a1a] bg-[#151515] flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest">Audit Logs (OS4)</span>
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="divide-y divide-[#1a1a1a] max-h-[400px] overflow-y-auto custom-scrollbar">
                      {logs.length === 0 && (
                        <div className="p-12 text-center text-gray-600 text-xs italic">
                          No tickets generated. Run an ingest to start.
                        </div>
                      )}
                      {logs.map((ticket, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={idx} 
                          className="p-4 hover:bg-[#151515] transition-colors"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                ticket.verdict === 'BLOCK' ? 'bg-red-500' :
                                ticket.verdict === 'HOLD' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`} />
                              <span className="text-[10px] font-bold text-orange-500 tracking-tighter">{ticket.signature_kernel}</span>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest ${
                              ticket.verdict === 'BLOCK' ? 'bg-red-900/30 text-red-500' :
                              ticket.verdict === 'HOLD' ? 'bg-yellow-900/30 text-yellow-500' :
                              'bg-green-900/30 text-green-500'
                            }`}>
                              {ticket.verdict}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-300 mb-3 pl-3.5 border-l border-[#222]">
                            Risk: {(ticket.risk * 100).toFixed(0)}% | Uncertainty: {(ticket.uncertainty * 100).toFixed(0)}%
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-3.5">
                            <span className="text-[8px] bg-[#1a1a1a] px-2 py-0.5 rounded text-gray-500 uppercase">
                              ID: {ticket.id}
                            </span>
                            <span className="text-[8px] bg-[#1a1a1a] px-2 py-0.5 rounded text-gray-500 uppercase">
                              SIG: {ticket.signature_kernel.substring(0, 8)}...
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS0 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os1_needs' && (
              <motion.div
                key="os1_needs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <AlertTriangle className="w-4 h-4" /> Needs Engine (OS1)
                    </h3>
                    <div className="space-y-4">
                      {['SYSTEM_INTEGRITY', 'ENERGY_OPTIMIZATION', 'DATA_CANONIZATION', 'THREAT_NEUTRALIZATION'].map(need => (
                        <div key={need} className="flex items-center justify-between p-4 bg-[#151515] border border-[#222] rounded">
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">{need}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500" style={{ width: `${Math.random() * 100}%` }} />
                            </div>
                            <span className="text-[10px] text-orange-500 font-bold">CRITICAL</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS1 Needs Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os2_knowledge' && (
              <motion.div
                key="os2_knowledge"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Database className="w-4 h-4" /> Knowledge Graph (OS2)
                    </h3>
                    <div className="aspect-square md:aspect-video bg-[#0a0a0a] border border-[#1a1a1a] rounded relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(50)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute w-1 h-1 bg-orange-500 rounded-full"
                            style={{ 
                              left: `${Math.random() * 100}%`, 
                              top: `${Math.random() * 100}%`,
                              opacity: Math.random()
                            }} 
                          />
                        ))}
                      </div>
                      <div className="relative text-center">
                        <Database className="w-12 h-12 text-orange-500/20 mx-auto mb-4" />
                        <p className="text-[10px] text-gray-600 uppercase tracking-[0.5em]">Mapping Sovereignty Relations</p>
                      </div>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS2 Knowledge Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os3_world' && (
              <motion.div
                key="os3_world"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Globe className="w-4 h-4" /> World Interface (OS3)
                    </h3>
                    <div className="p-12 text-center border border-[#1a1a1a] rounded-lg bg-black/20">
                      <Globe className="w-16 h-16 text-orange-500/10 mx-auto mb-6" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">External Reality Synchronized</p>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS3 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'sigma' && (
              <motion.div
                key="sigma"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Share2 className="w-4 h-4" /> SIGMA Trajectory Engine
                    </h3>
                    <div className="aspect-video bg-[#0a0a0a] border border-[#1a1a1a] rounded flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
                      <div className="relative w-full h-full p-8">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-orange-500/20" />
                        <div className="absolute top-0 left-1/2 w-px h-full bg-orange-500/20" />
                        <motion.div 
                          animate={{ 
                            x: [0, 100, 50, -50, 0],
                            y: [0, -50, 50, -20, 0]
                          }}
                          transition={{ duration: 10, repeat: Infinity }}
                          className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                        />
                        <div className="absolute bottom-4 right-4 text-[9px] font-mono text-orange-500/50">
                          TRAJECTORY_PREDICTION_ACTIVE
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Zap className="w-4 h-4" /> Evolutionary State
                    </h3>
                    <div className="space-y-4 mb-6">
                      {['Becoming', 'Unfolding', 'Actualization'].map((item) => (
                        <div key={item} className="p-4 bg-[#151515] border border-[#222] rounded flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-mono">{item}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      ))}
                    </div>
                    {activeSpecContent && (
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs border-t border-[#1a1a1a] pt-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'os1_reflex' && (
              <motion.div
                key="os1_reflex"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <Activity className="w-4 h-4" /> Reflexive Engine
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Active Reflexes</p>
                          <p className="text-xs text-orange-400 font-bold">DDoS_SHIELD, PAYLOAD_SANITY</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#151515] border border-[#222] rounded">
                            <p className="text-[9px] text-gray-600 uppercase">Detection Rate</p>
                            <p className="text-[11px] text-green-500">0.02ms</p>
                          </div>
                          <div className="p-3 bg-[#151515] border border-[#222] rounded">
                            <p className="text-[9px] text-gray-600 uppercase">Status</p>
                            <p className="text-[11px] text-green-500">ARMED</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <Shield className="w-4 h-4" /> Pattern Matching
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#151515] border border-[#222] rounded">
                          <span className="text-[10px] text-gray-400 uppercase">Heuristic Scan</span>
                          <span className="text-[10px] text-green-500 font-bold">ENABLED</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-gray-500">SQLi Protection</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-gray-500">XSS Sanitizer</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS1 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os2_quantum' && (
              <motion.div
                key="os2_quantum"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Cpu className="w-4 h-4" /> Quantum Research Engine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-12 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <Activity className="w-12 h-12 text-orange-500/20 mx-auto animate-pulse" />
                          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em]">Quantum Field Active</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[9px] text-gray-600 uppercase mb-2">Qubits Active</p>
                          <p className="text-2xl font-bold text-orange-500">1,024</p>
                        </div>
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[9px] text-gray-600 uppercase mb-2">Entanglement</p>
                          <p className="text-2xl font-bold text-orange-500">99.9%</p>
                        </div>
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[9px] text-gray-600 uppercase mb-2">Coherence</p>
                          <p className="text-2xl font-bold text-orange-500">420ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS2 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'sigma' && (
              <motion.div
                key="sigma"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Globe className="w-4 h-4" /> SIGMA Trajectory Engine
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#151515] border border-[#222] rounded">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Active Trajectory</p>
                        <p className="text-xs text-orange-400 font-bold">STABILIZED_SOVEREIGN_VIEW</p>
                      </div>
                      <div className="h-32 bg-[#0a0a0a] border border-[#1a1a1a] rounded flex items-center justify-center">
                        <div className="flex gap-1 items-end h-12">
                          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                            <motion.div 
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: h + '%' }}
                              transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse', delay: i * 0.1 }}
                              className="w-2 bg-orange-500/40 rounded-t"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Share2 className="w-4 h-4" /> World Connectors
                    </h3>
                    <div className="space-y-3">
                      {['LOCAL_FS', 'ETH_MAINNET', 'IPFS_NODE'].map(conn => (
                        <div key={conn} className="flex items-center justify-between p-3 bg-[#151515] border border-[#222] rounded">
                          <span className="text-[10px] text-gray-400">{conn}</span>
                          <span className="text-[9px] text-green-500 font-bold uppercase">Connected</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {activeSpecContent && (
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <BookOpen className="w-4 h-4" /> Sigma Specification
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {activeSpecContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'becoming' && (
              <motion.div
                key="becoming"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <Play className="w-4 h-4" /> Becoming Engine (OS7)
                      </h3>
                      <div className="p-12 text-center border border-dashed border-[#333] rounded-lg">
                        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Continuous Evolution in Progress</p>
                      </div>
                    </div>
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg">
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Becoming Documentation</h4>
                      <pre className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {getSystemDoc('system/sigma/becoming')}
                      </pre>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> Becoming Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'extensions' && (
              <motion.div
                key="extensions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Share2 className="w-4 h-4" /> System Extensions (OS10)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Plugin_A', 'Plugin_B', 'Module_X', 'Addon_Y'].map(ext => (
                        <div key={ext} className="p-4 bg-[#151515] border border-[#222] rounded text-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2" />
                          <span className="text-[10px] text-gray-400 uppercase">{ext}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> Extensions Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'operator' && (
              <motion.div
                key="operator"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Terminal className="w-4 h-4" /> Operator Console (OS11)
                    </h3>
                    <div className="bg-black p-4 rounded font-mono text-[11px] text-green-500 h-64 overflow-y-auto custom-scrollbar">
                      <div>&gt; SYSTEM_READY</div>
                      <div>&gt; WAITING_FOR_INPUT...</div>
                      <div className="animate-pulse">_</div>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> Operator Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os0_grammar' && (
              <motion.div
                key="os0_grammar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <BookOpen className="w-4 h-4" /> System Grammar
                    </h3>
                    <pre className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {getSystemDoc('system/os0/grammar')}
                    </pre>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS0 Grammar Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os0_constitution' && (
              <motion.div
                key="os0_constitution"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Shield className="w-4 h-4" /> Inter-Layer Constitution
                    </h3>
                    <pre className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {getSystemDoc('system/os0/constitution')}
                    </pre>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS0 Constitution Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'gps' && (
              <motion.div
                key="gps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Share2 className="w-4 h-4" /> Global Positioning System
                    </h3>
                    <div className="aspect-video bg-[#0a0a0a] border border-[#1a1a1a] rounded flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent" />
                      <div className="relative text-center">
                        <Globe className="w-16 h-16 text-orange-500/20 mx-auto mb-4 animate-pulse" />
                        <div className="text-[10px] font-mono text-orange-400">LAT: 48.8566° N | LON: 2.3522° E</div>
                        <div className="text-[10px] text-gray-600 uppercase mt-1">Sovereign Territory Locked</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl flex flex-col">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Globe className="w-4 h-4" /> GPS Specification
                    </h3>
                    {activeSpecContent && (
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <Shield className="w-4 h-4" /> Geofencing
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#151515] border border-[#222] rounded">
                        <p className="text-[10px] text-orange-400 uppercase mb-1">Active Perimeter</p>
                        <p className="text-xs text-white">Zone Alpha-7</p>
                      </div>
                      <div className="p-4 bg-[#151515] border border-[#222] rounded">
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Status</p>
                        <p className="text-xs text-green-500 font-bold uppercase">Secure</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                  <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                    <BookOpen className="w-4 h-4" /> Canonical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(() => {
                      const specsNode = explorer.find(n => n.name === 'specs');
                      if (!specsNode || !specsNode.children) return null;
                      
                      const allMdFiles: { path: string, name: string, category: string }[] = [];
                      const findMdFiles = (node: FileNode, category: string) => {
                        if (node.type === 'file' && node.name.endsWith('.md')) {
                          allMdFiles.push({ path: node.path, name: node.name, category });
                        } else if (node.children) {
                          node.children.forEach(child => findMdFiles(child, node.name === 'specs' ? category : node.name));
                        }
                      };
                      
                      specsNode.children.forEach(child => findMdFiles(child, child.name));

                      return allMdFiles.map(spec => (
                        <div 
                          key={spec.path}
                          onClick={() => fetchFile(spec.path, spec.name)}
                          className="p-4 bg-[#151515] border border-[#222] rounded-lg hover:border-orange-500/40 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-4 h-4 text-orange-500/60 group-hover:text-orange-500" />
                            <span className="text-xs font-bold text-gray-300 uppercase">{spec.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[9px] text-gray-600 uppercase tracking-wider">
                              {spec.category}
                            </p>
                            <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-orange-500 transition-colors" />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'os4_proof' && (
              <motion.div
                key="os4_proof"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-4 border-b border-[#1a1a1a] bg-[#151515] flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest">Merkle Audit Trace (OS4)</span>
                        <span className="text-[8px] text-orange-500 font-mono mt-1">ROOT: {status.merkle_root || '0x000...'}</span>
                      </div>
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#1a1a1a]">
                      {logs.length === 0 && (
                        <div className="p-12 text-center text-gray-600 text-xs italic">
                          No tickets generated.
                        </div>
                      )}
                      {logs.map((ticket, idx) => (
                        <div key={idx} className="p-6 hover:bg-[#151515] transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">{ticket.id}</p>
                              <p className="text-[9px] text-gray-600">{new Date(ticket.timestamp).toLocaleString()}</p>
                            </div>
                            <span className={`text-[10px] px-3 py-1 rounded font-bold uppercase tracking-widest ${
                              ticket.verdict === 'BLOCK' ? 'bg-red-900/30 text-red-500' :
                              ticket.verdict === 'HOLD' ? 'bg-yellow-900/30 text-yellow-500' :
                              'bg-green-900/30 text-green-500'
                            }`}>
                              {ticket.verdict}
                            </span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[9px] text-gray-600 uppercase mb-2">Cryptographic Signature</p>
                              <div className="p-2 bg-black rounded border border-[#222] font-mono text-[9px] text-orange-400 break-all">
                                {ticket.signature_kernel}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS4 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'os5_foundations' && (
              <motion.div
                key="os5_foundations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <Database className="w-4 h-4" /> Storage Engine
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Engine Status</p>
                          <p className="text-xs text-green-500 font-bold">OPERATIONAL</p>
                        </div>
                        <div className="p-4 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Integrity Check</p>
                          <p className="text-xs text-gray-400">LAST_RUN: 2026-04-01 00:00:00</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <Shield className="w-4 h-4" /> Identity Provider
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-[#151515] border border-[#222] rounded">
                          <span className="text-[10px] text-gray-400 uppercase">Sovereign Auth</span>
                          <span className="text-[10px] text-green-500 font-bold">ACTIVE</span>
                        </div>
                        <div className="p-3 bg-[#151515] border border-[#222] rounded">
                          <p className="text-[9px] text-gray-600 uppercase mb-1">Root Key</p>
                          <p className="text-[10px] text-orange-500 font-mono truncate">0x7f4b...9a12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> OS5 Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'canonical_forms' && (
              <motion.div
                key="canonical_forms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 p-4 lg:p-6 overflow-y-auto space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl">
                    <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                      <BookOpen className="w-4 h-4" /> Canonical Forms & Grammar
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: 'DecisionTicket', desc: 'The atomic unit of sovereignty. Contains verdict, reason, and full trace.' },
                        { title: 'SovereignObject', desc: 'Base class for all entities within the Obsidia ecosystem.' },
                        { title: 'ReflexPattern', desc: 'Pre-defined logic for immediate response to environmental stimuli.' },
                        { title: 'TrajectoryState', desc: 'A snapshot of the system\'s predicted future state.' },
                        { title: 'AuditTrace', desc: 'Immutable record of all system transitions and decisions.' },
                        { title: 'FoundationalIdentity', desc: 'Cryptographic proof of entity existence and authority.' }
                      ].map(form => (
                        <div key={form.title} className="p-4 bg-[#151515] border border-[#222] rounded hover:border-orange-500/30 transition-colors group">
                          <h4 className="text-[11px] font-bold text-orange-400 mb-2 group-hover:text-orange-500">{form.title}</h4>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{form.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeSpecContent && (
                    <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                      <h3 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> Forms Specification
                      </h3>
                      <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-orange max-w-none prose-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeSpecContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'editor' && (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              >
                {selectedFile ? (
                  <>
                    <div className="p-3 bg-[#111] border-b border-[#1a1a1a] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {selectedFile.isSystem ? <Shield className="w-4 h-4 text-orange-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest truncate max-w-[200px] lg:max-w-none">{selectedFile.path}</span>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-[10px] text-gray-600 hover:text-gray-400 font-bold">CLOSE_X</button>
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0d0d0d] custom-scrollbar">
                      {selectedFile.isSystem ? (
                        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
                          <div className="border-b border-orange-500/30 pb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-orange-500 tracking-tighter uppercase">{selectedFile.name}</h2>
                            <p className="text-[10px] text-gray-600 mt-2">CANONICAL_MODULE_SPEC_V1.0</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                            <div className="p-4 bg-[#111] border border-[#1a1a1a] rounded">
                              <p className="text-[9px] text-gray-600 uppercase mb-2">Integrity</p>
                              <p className="text-xs text-green-500 font-bold">VERIFIED</p>
                            </div>
                            <div className="p-4 bg-[#111] border border-[#1a1a1a] rounded">
                              <p className="text-[9px] text-gray-600 uppercase mb-2">Sovereignty</p>
                              <p className="text-xs text-orange-500 font-bold">ABSOLUTE</p>
                            </div>
                            <div className="p-4 bg-[#111] border border-[#1a1a1a] rounded">
                              <p className="text-[9px] text-gray-600 uppercase mb-2">Audit</p>
                              <p className="text-xs text-blue-500 font-bold">OS4_SYNC</p>
                            </div>
                          </div>
                          {selectedFile.name.endsWith('.md') ? (
                            <div className="prose prose-invert prose-orange max-w-none prose-xs p-4 lg:p-6 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {selectedFile.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <pre className="text-[11px] lg:text-[13px] leading-relaxed text-gray-400 whitespace-pre-wrap font-mono bg-[#0f0f0f] p-4 lg:p-6 border border-[#1a1a1a] rounded-lg">
                              {selectedFile.content}
                            </pre>
                          )}
                        </div>
                      ) : (
                        selectedFile.name.endsWith('.md') ? (
                          <div className="prose prose-invert prose-orange max-w-none prose-xs p-4 lg:p-6">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {selectedFile.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <pre className="p-4 lg:p-6 text-[11px] lg:text-[12px] leading-relaxed text-gray-300 selection:bg-orange-500/30">
                            <code>{selectedFile.content}</code>
                          </pre>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-4 p-6 text-center">
                    <Database className="w-12 h-12 opacity-10" />
                    <p className="text-[10px] uppercase tracking-[0.3em]">Select a module or file to inspect its core</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Telemetry: Right Panel */}
      <div className={`
        fixed lg:relative inset-y-0 right-0 z-40 w-72 border-l border-[#1a1a1a] bg-[#0f0f0f] flex flex-col transition-transform duration-300 lg:translate-x-0
        ${isTelemetryOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest">System Telemetry</span>
          </div>
          <button onClick={() => setIsTelemetryOpen(false)} className="lg:hidden p-1.5 text-gray-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
          <TelemetryBlock label="OS0 KERNEL" state={status.os0} />
          <TelemetryBlock label="OS1 NEEDS" state={status.os1_needs} />
          <TelemetryBlock label="OS1 REFLEX" state={status.os1_reflex} />
          <TelemetryBlock label="OS2 RESEARCH" state={status.os2} />
          <TelemetryBlock label="OS3 WORLD" state={status.os3} />
          <TelemetryBlock label="OS4 PROOF" state={status.os4} />
          <TelemetryBlock label="OS5 FOUNDATIONS" state={status.os5} />
        </div>
      </div>

      {/* Mobile Overlays */}
      <AnimatePresence>
        {(isSidebarOpen || isTelemetryOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsSidebarOpen(false); setIsTelemetryOpen(false); }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TelemetryBlock({ label, state }: { label: string, state: string }) {
  return (
    <div className="bg-[#111] border border-[#1a1a1a] p-3 rounded">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
        <div className={`w-2 h-2 rounded-full ${state && state !== 'idle' ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
      </div>
      <div className="text-[11px] uppercase tracking-tighter flex items-center gap-2">
        <Cpu className="w-3 h-3 text-orange-500/50" />
        <span className={state && state !== 'idle' ? 'text-orange-400' : 'text-gray-600'}>{state || 'IDLE'}</span>
      </div>
    </div>
  );
}

function ExplorerTree({ nodes, onFileClick, depth = 0 }: { nodes: FileNode[], onFileClick: (path: string, name: string) => void, depth?: number }) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <div key={node.path}>
          <motion.div 
            whileHover={{ x: 4 }}
            onClick={() => node.type === 'file' && onFileClick(node.path, node.name)}
            className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer group transition-all duration-200 ${
              node.type === 'file' ? 'hover:bg-[#1a1a1a]' : 'cursor-default'
            }`} 
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {node.type === 'directory' ? (
              <FolderTree className={`w-3.5 h-3.5 transition-colors ${node.path.startsWith('system/') ? 'text-orange-500' : 'text-orange-500/60 group-hover:text-orange-500'}`} />
            ) : (
              <FileText className={`w-3.5 h-3.5 transition-colors ${node.path.startsWith('system/') ? 'text-orange-400' : 'text-gray-600 group-hover:text-orange-400/60'}`} />
            )}
            <span className={`text-[11px] truncate transition-colors ${
              node.type === 'directory' 
                ? (node.path.startsWith('system/') ? 'text-orange-100 font-bold' : 'text-gray-500 font-bold') 
                : (node.path.startsWith('system/') ? 'text-orange-300/80 group-hover:text-orange-200' : 'text-gray-400 group-hover:text-gray-200')
            }`}>
              {node.name}
            </span>
          </motion.div>
          {node.children && <ExplorerTree nodes={node.children} onFileClick={onFileClick} depth={depth + 1} />}
        </div>
      ))}
    </div>
  );
}
