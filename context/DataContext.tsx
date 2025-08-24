import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { Participant, Winner, Event, Organizer, Raffle } from '../types';

interface DataContextType {
  // Admin state
  events: Event[];
  organizers: Organizer[];
  raffles: Raffle[];
  
  // Organizer state
  loggedInOrganizer: Organizer | null;
  organizerEvents: Event[]; // All events for the logged-in organizer
  selectedEvent: Event | null; // The currently active event
  selectedEventRaffles: Raffle[]; // Raffles for the selected event
  selectedRaffle: Raffle | null; // The currently active raffle for drawing
  participants: Participant[]; // Participants for the selected raffle
  winners: Winner[]; // Winners for the selected raffle
  
  // Auth functions
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setSelectedEventId: (eventId: string | null) => void;
  setSelectedRaffleId: (raffleId: string | null) => void;

  // Data functions
  findRaffleByCode: (code: string) => Promise<(Raffle & { event: Event }) | null>;
  addParticipant: (details: { name: string; phone: string; email: string; raffleId: string; }) => Promise<{ success: boolean; message: string }>;
  drawWinner: () => Promise<Participant | null>;
  getEligibleParticipantCount: () => number;
  createEvent: (name: string, organizerId: string) => Promise<{ success: boolean; message: string }>;
  createOrganizer: (name: string, email: string, password: string, organizerCode: string) => Promise<{ success: boolean; message: string }>;
  createEventWithRaffle: (data: { eventName: string; raffleName: string; raffleQuantity: number; raffleCode: string; }) => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- Mock Initial Data ---
const initialOrganizers: Organizer[] = [
    { id: 'org_1', name: 'Admin TechConf', email: 'admin@triad3.io', password: '123', organizerCode: 'TCNF' },
    { id: 'org_2', name: 'Festa Corp', email: 'admin@festacorp.com', password: 'password123', organizerCode: 'FCORP' },
];

const initialEvents: Event[] = [
    { id: 'evt_1700000000000', name: 'Conferência Tech 2024', organizerId: 'org_1', code: 'TCNFTECH' },
    { id: 'evt_1710000000000', name: 'Festa de Fim de Ano', organizerId: 'org_2', code: 'FCORPFEST' },
];

const initialRaffles: Raffle[] = [
    { id: 'raf_1', eventId: 'evt_1700000000000', name: 'Monitor Gamer 4K', quantity: 1, code: 'TCNFTECH4K' },
    { id: 'raf_2', eventId: 'evt_1700000000000', name: 'Teclado Mecânico', quantity: 3, code: 'TCNFKEYCAPS' },
    { id: 'raf_3', eventId: 'evt_1710000000000', name: 'Cesta de Natal', quantity: 5, code: 'FCORPNATAL24' },
];

const allParticipants: Participant[] = [
    // Raffle 1
    { id: 1, name: 'Ana Silva', phone: '(11) 98765-4321', email: 'ana.silva@example.com', isWinner: false, raffleId: 'raf_1' },
    { id: 2, name: 'Bruno Costa', phone: '(21) 91234-5678', email: 'bruno.costa@example.com', isWinner: false, raffleId: 'raf_1' },
    // Raffle 2
    { id: 3, name: 'Carlos Dias', phone: '(31) 99999-8888', email: 'carlos.dias@example.com', isWinner: false, raffleId: 'raf_2' },
    // Raffle 3
    { id: 6, name: 'Felipe Gomes', phone: '(61) 92222-5555', email: 'felipe.gomes@example.com', isWinner: false, raffleId: 'raf_3' },
    { id: 7, name: 'Gabriela Rocha', phone: '(71) 91111-4444', email: 'gabriela.rocha@example.com', isWinner: false, raffleId: 'raf_3' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizers, setOrganizers] = useState<Organizer[]>(initialOrganizers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [raffles, setRaffles] = useState<Raffle[]>(initialRaffles);
  const [participants, setParticipants] = useState<Participant[]>(shuffleArray(allParticipants));
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loggedInOrganizer, setLoggedInOrganizer] = useState<Organizer | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedRaffleId, setSelectedRaffleId] = useState<string | null>(null);

  // --- DERIVED STATE ---
  const organizerEvents = useMemo(() => {
    if (!loggedInOrganizer) return [];
    return events.filter(e => e.organizerId === loggedInOrganizer.id);
  }, [events, loggedInOrganizer]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(e => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);
  
  const selectedRaffle = useMemo(() => {
    if (!selectedRaffleId) return null;
    return raffles.find(r => r.id === selectedRaffleId) || null;
  }, [raffles, selectedRaffleId]);

  const currentParticipants = useMemo(() => {
    if (!selectedRaffleId) return [];
    return participants.filter(p => p.raffleId === selectedRaffleId);
  }, [participants, selectedRaffleId]);

  const currentWinners = useMemo(() => {
    if (!selectedRaffle) return [];
    return winners.filter(w => w.raffleId === selectedRaffle.id);
  }, [winners, selectedRaffle]);

  const selectedEventRaffles = useMemo(() => {
    if (!selectedEvent) return [];
    return raffles.filter(r => r.eventId === selectedEvent.id);
  }, [raffles, selectedEvent]);


  // --- AUTH FUNCTIONS ---
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const organizer = organizers.find(o => o.email.toLowerCase() === email.toLowerCase());
    if (organizer && organizer.password === password) {
      setLoggedInOrganizer(organizer);
      const firstEventForOrg = events.find(e => e.organizerId === organizer.id);
      setSelectedEventId(firstEventForOrg ? firstEventForOrg.id : null);
      setSelectedRaffleId(null);
      return { success: true, message: 'Login bem-sucedido!' };
    }
    return { success: false, message: 'E-mail ou senha inválidos.' };
  }, [organizers, events]);

  const logout = useCallback(() => {
    setLoggedInOrganizer(null);
    setSelectedEventId(null);
    setSelectedRaffleId(null);
  }, []);
  
  const findRaffleByCode = useCallback(async (code: string): Promise<(Raffle & { event: Event }) | null> => {
    const raffle = raffles.find(r => r.code.toLowerCase() === code.toLowerCase());
    if (!raffle) return null;
    const event = events.find(e => e.id === raffle.eventId);
    if (!event) return null; // Should not happen in a consistent dataset
    return { ...raffle, event };
  }, [raffles, events]);

  // --- ADMIN FUNCTIONS ---
  const createOrganizer = useCallback(async (name: string, email: string, password: string, organizerCode: string): Promise<{ success: boolean; message: string }> => {
     if (organizers.some(o => o.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Este e-mail já está em uso.' };
     }
     if (organizers.some(o => o.organizerCode.toLowerCase() === organizerCode.toLowerCase())) {
        return { success: false, message: 'Este código de organizador já está em uso.' };
     }
      if (!organizerCode.trim()) {
        return { success: false, message: 'O código do organizador não pode estar vazio.' };
     }
     const newOrganizer: Organizer = { id: `org_${Date.now()}`, name, email, password, organizerCode: organizerCode.trim() };
     setOrganizers(prev => [...prev, newOrganizer]);
     return { success: true, message: 'Organizador criado com sucesso!' };
  }, [organizers]);

  const createEvent = useCallback(async (name: string, organizerId: string): Promise<{ success: boolean; message: string }> => {
    if (!name.trim()) {
        return { success: false, message: 'O nome do evento não pode estar vazio.' };
    }
    const organizer = organizers.find(o => o.id === organizerId);
    if (!organizer) {
        return { success: false, message: 'Organizador não encontrado.' };
    }
    const eventCode = `${organizer.organizerCode}${name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`;
    const newEvent: Event = { id: `evt_${Date.now()}`, name, organizerId, code: eventCode };
    setEvents(prev => [...prev, newEvent]);
    return { success: true, message: 'Evento criado com sucesso!' };
  }, [organizers]);

  // --- ORGANIZER DATA FUNCTIONS ---
  const createEventWithRaffle = useCallback(async (data: { eventName: string; raffleName: string; raffleQuantity: number; raffleCode: string; }): Promise<{ success: boolean; message: string; }> => {
    if (!loggedInOrganizer) {
        return { success: false, message: 'Nenhum organizador logado.' };
    }

    const { eventName, raffleName, raffleQuantity, raffleCode } = data;

    // Find if event already exists for this organizer
    let event = events.find(e => e.name.toLowerCase() === eventName.toLowerCase() && e.organizerId === loggedInOrganizer.id);

    // If event doesn't exist, create it
    if (!event) {
        const eventCode = `${loggedInOrganizer.organizerCode}${eventName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`;
        const newEvent: Event = { id: `evt_${Date.now()}`, name: eventName, organizerId: loggedInOrganizer.id, code: eventCode };
        setEvents(prev => [...prev, newEvent]);
        event = newEvent;
    }
    
    // Set the created/found event as the active one
    setSelectedEventId(event.id);

    // Construct the full raffle code using the organizer's code as a prefix
    const fullRaffleCode = `${loggedInOrganizer.organizerCode}${raffleCode}`;
    
    // Check if this raffle code already exists for this specific event
    if (raffles.some(r => r.code.toLowerCase() === fullRaffleCode.toLowerCase())) {
        return { success: false, message: `O código de sorteio "${fullRaffleCode}" já existe.` };
    }


    // Create the new raffle for that event
    const newRaffle: Raffle = {
        id: `raf_${Date.now()}`,
        eventId: event.id,
        name: raffleName,
        quantity: raffleQuantity,
        code: fullRaffleCode,
    };
    setRaffles(prev => [...prev, newRaffle]);

    return { success: true, message: 'Sorteio adicionado ao evento com sucesso!' };

  }, [events, raffles, loggedInOrganizer]);

  const addParticipant = useCallback(async (details: { name: string; phone: string; email: string; raffleId: string; }): Promise<{ success: boolean; message: string }> => {
    const { name, phone, email, raffleId } = details;

    if (!raffleId) {
        return { success: false, message: 'ID do sorteio inválido.' };
    }
    if (participants.some(p => p.email.toLowerCase() === email.toLowerCase() && p.raffleId === raffleId)) {
      return { success: false, message: 'Este e-mail já está cadastrado neste sorteio.' };
    }
    const newParticipant: Participant = {
      id: Date.now(),
      name,
      phone,
      email,
      isWinner: false,
      raffleId: raffleId,
    };
    setParticipants(prev => [...prev, newParticipant]);
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  }, [participants]);

  const drawWinner = useCallback(async (): Promise<Participant | null> => {
     if (!selectedRaffleId) return null;

     const eligible = participants.filter(p => p.raffleId === selectedRaffleId && !p.isWinner);
     if (eligible.length === 0) return null;
     
     const winnerIndex = Math.floor(Math.random() * eligible.length);
     const winner = eligible[winnerIndex];

     setParticipants(prev =>
         prev.map(p => (p.id === winner.id ? { ...p, isWinner: true } : p))
     );
     
     const newWinner: Winner = { ...winner, isWinner: true, drawnAt: new Date() };
     setWinners(prev => [...prev, newWinner]);
     
     return winner;
  }, [participants, selectedRaffleId]);
  
  const getEligibleParticipantCount = useCallback(() => {
    if (!selectedRaffleId) return 0;
    return participants.filter(p => p.raffleId === selectedRaffleId && !p.isWinner).length;
  }, [participants, selectedRaffleId]);

  return (
    <DataContext.Provider value={{ 
        events, 
        organizers,
        raffles,
        loggedInOrganizer,
        organizerEvents,
        selectedEvent, 
        selectedEventRaffles,
        selectedRaffle,
        participants: currentParticipants, 
        winners: currentWinners, 
        login,
        logout,
        setSelectedEventId,
        setSelectedRaffleId,
        findRaffleByCode,
        addParticipant, 
        drawWinner, 
        getEligibleParticipantCount,
        createEvent,
        createOrganizer,
        createEventWithRaffle,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};