export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-primary-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left visual */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Safe & Sterile</h4>
                <p className="text-sm text-muted-foreground">
                  Hospital-grade sterilization protocols
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Top Rated</h4>
                <p className="text-sm text-muted-foreground">
                  4.9 stars from 500+ reviews
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">On Time</h4>
                <p className="text-sm text-muted-foreground">
                  Minimal wait, respect your time
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Gentle Care</h4>
                <p className="text-sm text-muted-foreground">
                  Pain-free, comfortable experience
                </p>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-6">
            <p className="text-primary font-semibold text-sm tracking-wide uppercase">
              About Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Trusted Dental Care for Your Entire Family
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At SmileCare Dental, we believe everyone deserves a healthy,
              confident smile. Our experienced team combines the latest
              technology with a gentle, caring approach to make your dental
              visit a positive experience.
            </p>
            <ul className="space-y-3">
              {[
                "State-of-the-art dental equipment",
                "Experienced and certified dental professionals",
                "Comfortable and relaxing clinic environment",
                "Affordable treatment with transparent pricing",
                "Easy online booking with WhatsApp confirmation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
