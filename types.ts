
export interface Organizer {
  id: string;
  name: string;
  email: string;
  organizerCode: string;
  password?: string; // Should not be exposed in context, but useful for mock data
}

export interface Event {
  id: string;
  name: string;
  organizerId: string;
  code: string;
}

export interface Raffle {
  id: string;
  name: string; // Objeto do Sorteio
  quantity: number;
  imageUrl?: string;
  code: string;
  eventId: string;
}

export interface Participant {
  id: number;
  name: string;
  phone: string;
  email: string;
  isWinner: boolean;
  raffleId: string;
}

export interface Winner extends Participant {
  drawnAt: Date;
}