'use client';

import { RadioTower } from 'lucide-react';

interface Props {
  zones: Array<{
    source?: string;
  }>;
}

export default function WeatherBadge({ zones }: Props) {
  const hasLiveData = zones && zones.length > 0;
  const source = hasLiveData ? zones[0]?.source : null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 border border-[#241d34] bg-[#09080d] px-3 py-2">
        <span className={`h-2 w-2 ${hasLiveData ? 'bg-emerald-300' : 'bg-[#655d72]'}`} />
        <RadioTower size={14} className="text-[#8b5cf6]" />
        <span className="text-xs text-[#8f879d]">
          {hasLiveData ? `Live data / ${source || 'simulator'}` : 'Awaiting feed'}
        </span>
      </div>
    </div>
  );
}
