'use client';

interface BookSpineProps {
  bindingColor: string;
}

export function BookSpine({ bindingColor }: BookSpineProps) {
  return (
    <div
      className="hidden md:flex relative w-8 md:w-12 h-full flex-shrink-0"
      style={{
        background: `linear-gradient(90deg,
          ${bindingColor} 0%,
          rgba(0,0,0,0.6) 20%,
          rgba(0,0,0,0.8) 50%,
          rgba(0,0,0,0.6) 80%,
          ${bindingColor} 100%
        )`,
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Ring binding holes */}
      <div className="absolute inset-x-0 top-12 bottom-12 flex flex-col justify-around items-center">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 md:w-5 md:h-5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #888 0%, #ccc 50%, #999 100%)',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
