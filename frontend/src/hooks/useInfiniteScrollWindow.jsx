import { useEffect } from 'react';
import { isMobile } from '@/common/constants';

export function useInfiniteScrollWindow({ pagination, setPagination }) {
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const threshold = 200;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - threshold;

      if (atBottom && pagination.hasMore && !pagination.loadMore) {
        setPagination((prev) => ({ ...prev, loadMore: true }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pagination.hasMore, pagination.loadMore]);
}
