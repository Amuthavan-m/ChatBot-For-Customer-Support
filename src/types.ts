export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  action?: BotAction;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  showtimes: string[];
}

export interface Seat {
  id: string;
  code: string;  // e.g., "A1", "B5"
  price: number;
  status: 'available' | 'taken';
}

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

export interface TicketData {
  movieTitle: string;
  theatre: string;
  date: string;
  time: string;
  seats: string[];
  bookingId: string;
  customerName?: string;
  genre: string;
}

// Bot action types
export type BotAction = {
  type: 'selectTheatre' | 'selectSeats' | 'payment' | 'ticket';
  data: any; // This would be more strictly typed in a real application
};

export interface BotResponse {
  message: string;
  action?: BotAction | null;
}