import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../Button';
import './QueryWrapper.scss';

interface QueryWrapperProps<T> {
  query: Pick<UseQueryResult<T>, 'data' | 'isLoading' | 'isError' | 'refetch'>;
  children: (data: T) => ReactNode;
  loadingMessage?: string;
}

export function QueryWrapper<T>({ query, children, loadingMessage }: QueryWrapperProps<T>) {
  const { data, isLoading, isError, refetch } = query;

  return (
    <div aria-busy={isLoading} aria-live="polite">
      {isLoading && <LoadingSpinner message={loadingMessage} />}
      {isError && (
        <div className="query-wrapper__error">
          <p>Something went wrong.</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}
      {data && children(data)}
    </div>
  );
}
