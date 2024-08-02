import React from 'react';

function WelcomeGrid() {
  return (
    <div className="bg-zinc-950 text-zinc-100 py-16">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-zinc-700">
          <h3 className="text-2xl font-bold text-zinc-400 mb-4">Reason 1</h3>
          <p className="text-lg text-zinc-100">Brief explanation of reason 1.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-zinc-700">
          <h3 className="text-2xl font-bold text-zinc-400 mb-4">Reason 2</h3>
          <p className="text-lg text-zinc-100">Brief explanation of reason 2.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-zinc-700">
          <h3 className="text-2xl font-bold text-zinc-400 mb-4">Reason 3</h3>
          <p className="text-lg text-zinc-100">Brief explanation of reason 3.</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeGrid;
