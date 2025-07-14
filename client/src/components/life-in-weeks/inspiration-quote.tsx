import { useState, useEffect } from "react";

const quotes = [
  "You could leave life right now. Let that determine what you do and say and think.",
  "We are finite, time-limited creatures, and that's precisely what makes our choices meaningful.",
  "The average human lifespan is absurdly, insultingly brief.",
  "Those are your weeks and they're all you've got.",
  "Time management for mortals: the maddening truth about 4,000 weeks.",
  "The real problem isn't that there's too little time; it's that we've been conditioned to see time as something we can control."
];

export default function InspirationQuote() {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  return (
    <section className="inspiration-section">
      <div className="quote-container">
        <blockquote className="quote-text">
          "{currentQuote}"
        </blockquote>
        <cite className="quote-author">— Oliver Burkeman</cite>
      </div>
    </section>
  );
}
