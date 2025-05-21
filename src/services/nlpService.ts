import { Message, BotAction, BotResponse, Theatre, Seat, TicketData } from '../types';

// NLP message processor
export const processMessage = async (
  text: string,
  history: Message[],
  currentAction: BotAction | null
): Promise<BotResponse> => {
  const lowerText = text.toLowerCase();

  if (containsAny(lowerText, ['movie', 'watch', 'see', 'showing', 'films', 'cinema']) && !currentAction) {
    return handleMovieIntent(text);
  }

  if (containsAny(lowerText, ['theatre', 'theater', 'location', 'where', 'place']) ||
      (currentAction?.type === 'selectTheatre' && containsAny(lowerText, ['book', 'select', 'choose', 'that one']))) {
    return handleTheatreSelection(text, currentAction);
  }

  if (containsAny(lowerText, ['seat', 'sit', 'place', 'position']) ||
      (currentAction?.type === 'selectSeats' && currentAction?.data?.selectedSeats?.length)) {
    return handleSeatSelection(text, currentAction);
  }

  if (containsAny(lowerText, ['pay', 'purchase', 'buy', 'checkout', 'payment', 'book']) ||
      (currentAction?.type === 'payment' && currentAction?.data?.customerData)) {
    return handlePaymentIntent(text, currentAction);
  }

  if (containsAny(lowerText, ['ticket', 'receipt', 'confirmation', 'completed', 'done', 'finished']) ||
      currentAction?.type === 'ticket') {
    return handleTicketIntent(text, currentAction);
  }

  return {
    message: "🤖 I didn't quite catch that. Would you like to book a movie, select seats, or complete your payment?",
  };
};

const containsAny = (text: string, keywords: string[]): boolean => {
  return keywords.some(keyword => text.includes(keyword));
};

const handleMovieIntent = (text: string): BotResponse => {
  const movieMatch = text.match(/(?:watch|see|movie|film|for)\s+([A-Za-z\s:]+)(?:$|\?|\.)/i);
  const movieTitle = movieMatch ? movieMatch[1].trim() : "Avengers: Endgame";

  const theatres: Theatre[] = [
    {
      id: 't1',
      name: 'Cinema City',
      location: '123 Main St, Downtown',
      showtimes: ['10:00 AM', '1:30 PM', '4:45 PM', '8:00 PM']
    },
    {
      id: 't2',
      name: 'Silver Screen Cinemas',
      location: '456 Park Ave, Uptown',
      showtimes: ['11:15 AM', '2:45 PM', '6:15 PM', '9:30 PM']
    },
    {
      id: 't3',
      name: 'Plaza Theatres',
      location: '789 Broadway, Westside',
      showtimes: ['10:30 AM', '1:00 PM', '3:45 PM', '7:15 PM', '10:00 PM']
    }
  ];

  return {
    message: `🎬 "${movieTitle}" is available at multiple theatres. Please select a theatre:`,
    action: {
      type: 'selectTheatre',
      data: {
        movieTitle,
        theatres
      }
    }
  };
};

const handleTheatreSelection = (text: string, currentAction: BotAction | null): BotResponse => {
  if (!currentAction || currentAction.type !== 'selectTheatre') {
    return handleMovieIntent(text);
  }

  const { movieTitle, theatres, selectedTheatre } = currentAction.data;
  const lowerText = text.toLowerCase();

  if (!selectedTheatre) {
    for (const theatre of theatres) {
      if (lowerText.includes(theatre.name.toLowerCase())) {
        return {
          message: `✅ You've selected ${theatre.name}. Which showtime would you prefer?`,
          action: {
            type: 'selectTheatre',
            data: {
              movieTitle,
              theatres,
              selectedTheatre: theatre
            }
          }
        };
      }
    }

    return {
      message: "📍 Please choose one of the available theatres from the list above.",
      action: currentAction
    };
  }

  // Generate seats
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E'];
  for (let row of rows) {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: row + i,
        code: row + i,
        price: 12.99,
        status: Math.random() < 0.3 ? 'taken' : 'available'
      });
    }
  }

  return {
    message: `🎟️ You've selected ${selectedTheatre.name} for "${movieTitle}" at ${selectedTheatre.showtimes[0]}. Please select your seats:`,
    action: {
      type: 'selectSeats',
      data: {
        movieTitle,
        theatre: selectedTheatre,
        showtime: selectedTheatre.showtimes[0],
        seats,
        selectedSeats: []
      }
    }
  };
};

const handleSeatSelection = (text: string, currentAction: BotAction | null): BotResponse => {
  if (!currentAction || currentAction.type !== 'selectSeats') {
    return {
      message: "⚠️ Let's start by picking a movie and theatre first.",
    };
  }

  const { movieTitle, theatre, showtime, selectedSeats } = currentAction.data;

  if (selectedSeats && selectedSeats.length > 0) {
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2);

    return {
      message: `🪑 You've selected ${selectedSeats.length} seat(s): ${selectedSeats.map(s => s.code).join(', ')}. The total price is $${totalPrice}. Please provide your name and email to proceed to payment:`,
      action: {
        type: 'payment',
        data: {
          movieTitle,
          theatre,
          showtime,
          selectedSeats,
          totalPrice
        }
      }
    };
  }

  return {
    message: "🔔 Please select at least one available seat to proceed.",
    action: currentAction
  };
};

const handlePaymentIntent = (text: string, currentAction: BotAction | null): BotResponse => {
  if (!currentAction) {
    return { message: "🔍 Let's begin by selecting a movie." };
  }

  if (currentAction.type === 'payment' && currentAction.data.customerData) {
    const ticketData: TicketData = {
      movieTitle: currentAction.data.movieTitle,
      theatre: currentAction.data.theatre.name,
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: currentAction.data.showtime,
      seats: currentAction.data.selectedSeats.map(seat => seat.code),
      bookingId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      customerName: currentAction.data.customerData.fullName,
      genre: "Action/Adventure"
    };

    return {
      message: `✅ Payment successful! Your booking for "${ticketData.movieTitle}" is confirmed. Here's your ticket 👇`,
      action: {
        type: 'ticket',
        data: ticketData
      }
    };
  }

  return {
    message: "💳 Please complete the form with your name and email to confirm payment.",
    action: currentAction
  };
};

const handleTicketIntent = (text: string, currentAction: BotAction | null): BotResponse => {
  if (!currentAction || currentAction.type !== 'ticket') {
    return {
      message: "🎟️ Let's start by booking a movie ticket first.",
    };
  }

  return {
    message: "📩 Your ticket has been sent via email. Enjoy your movie! 🍿",
    action: null
  };
};
