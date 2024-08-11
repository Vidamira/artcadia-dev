import React from 'react';

function WelcomeGrid() {
  return (
    <section className="bg-zinc-950 text-zinc-100  px-4 mx-8">
      <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        <p className="text-lg max-w-300 order-1 md:text-right md:order-2">Artcadia Gallery offers a curated selection of contemporary art, helping you find the perfect piece for your space.</p>
        <h2 className="text-6xl font-bold text-let md:text-left md:order-1">DISCOVER YOUR PERFECT PIECE</h2>
      </div>
    </section>
  );
}

export default WelcomeGrid;
