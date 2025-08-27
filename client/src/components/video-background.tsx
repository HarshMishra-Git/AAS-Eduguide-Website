import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export default function VideoBackground() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (isIntersecting) {
      setShouldLoad(true);
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full hidden md:block">
      {shouldLoad && (
        <iframe
          className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2 scale-110 opacity-20"
          src="https://www.youtube.com/embed/2SDtd9RIAzE?autoplay=1&mute=1&loop=1&playlist=2SDtd9RIAzE&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
          title="Background Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
}