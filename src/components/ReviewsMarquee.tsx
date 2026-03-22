const reviews = [
  { name: "Aisha M.", text: "This platform matched me with a job in 2 days. Incredible." },
  { name: "Tunde O.", text: "The NIN verification made everything so smooth and trustworthy." },
  { name: "Grace E.", text: "I love the bot — creating my profile took less than 5 minutes." },
  { name: "Chidi N.", text: "Finally a hiring tool that actually understands Nigerian talent." },
  { name: "Fatima B.", text: "Our company filled 12 positions in one week. Game changer." },
  { name: "Emeka A.", text: "Cross-platform access means I never re-enter my data. Brilliant." },
];

const ReviewsMarquee = () => {
  return (
    <section id="reviews" className="py-20 bg-background overflow-hidden">
      <div className="container mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-balance">
          What People Are Saying
        </h2>
      </div>

      <div className="animate-marquee-fast flex gap-6 whitespace-nowrap">
        {[...reviews, ...reviews].map((r, i) => (
          <div
            key={i}
            className="inline-flex flex-col min-w-[300px] max-w-[300px] bg-card border border-border p-6 shrink-0 whitespace-normal"
          >
            <p className="text-sm leading-relaxed text-foreground italic">"{r.text}"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">
                {r.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{r.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsMarquee;
