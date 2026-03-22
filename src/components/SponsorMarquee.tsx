const sponsors = [
  "Microsoft", "Google", "MTN", "Flutterwave", "Andela",
  "Paystack", "Interswitch", "Oracle", "AWS", "Dangote",
];

const SponsorMarquee = () => {
  return (
    <div className="bg-muted border-b overflow-hidden h-[50px] flex items-center">
      <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
        {[...sponsors, ...sponsors].map((name, i) => (
          <span
            key={i}
            className="text-xs font-medium tracking-widest uppercase text-muted-foreground/60 select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SponsorMarquee;
