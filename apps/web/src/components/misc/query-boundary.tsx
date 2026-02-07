/** biome-ignore-all lint/style/useNamingConvention: safe */
import {
  createContext,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

import type { UseQueryResult } from "@tanstack/react-query";

type QueryBoundaryContextValue<TData, TError> = {
  query: UseQueryResult<TData, TError>;
  isDataEmpty: boolean;
};

const QueryBoundaryContext = createContext<QueryBoundaryContextValue<
  unknown,
  unknown
> | null>(null);

function useQueryBoundaryContext<TData, TError>() {
  const context = useContext(QueryBoundaryContext);
  if (!context) {
    throw new Error(
      "QueryBoundary sub-components must be used within a QueryBoundary",
    );
  }
  return context as QueryBoundaryContextValue<TData, TError>;
}

function LoadingComponent({ children }: PropsWithChildren) {
  const { query } = useQueryBoundaryContext<unknown, unknown>();
  if (!(query.isLoading || query.isPending)) return null;
  return <>{children}</>;
}

type ErrorProps<TError> = {
  children: (error: TError) => ReactNode;
};

function ErrorComponent<TError = Error>({ children }: ErrorProps<TError>) {
  const { query } = useQueryBoundaryContext<unknown, TError>();
  if (!query.isError) return null;
  return <>{children(query.error as TError)}</>;
}

function EmptyComponent({ children }: PropsWithChildren) {
  const { query, isDataEmpty } = useQueryBoundaryContext<unknown, unknown>();
  if (!(query.isSuccess && isDataEmpty)) return null;
  return <>{children}</>;
}

type SuccessProps<TData> = {
  children: (data: TData) => ReactNode;
};

function SuccessComponent<TData>({ children }: SuccessProps<TData>) {
  const { query, isDataEmpty } = useQueryBoundaryContext<TData, unknown>();
  if (!query.isSuccess || isDataEmpty) return null;
  return <>{children(query.data as TData)}</>;
}

type BoundComponents<TData, TError> = {
  Loading: FC<PropsWithChildren>;
  Error: FC<ErrorProps<TError>>;
  Empty: FC<PropsWithChildren>;
  Success: FC<SuccessProps<TData>>;
};

type QueryBoundaryProps<TData, TError> = {
  query: UseQueryResult<TData, TError>;
  checkIsEmpty?: (data: TData) => boolean;
  children:
    | ReactNode
    | ((components: BoundComponents<TData, TError>) => ReactNode);
};

export function QueryBoundary<TData, TError = Error>({
  query,
  checkIsEmpty,
  children,
}: QueryBoundaryProps<TData, TError>) {
  const isDataEmpty = useMemo(() => {
    if (query.data !== undefined && checkIsEmpty) {
      return checkIsEmpty(query.data);
    }
    return false;
  }, [query.data, checkIsEmpty]);

  const contextValue = useMemo(
    () => ({ isDataEmpty, query }),
    [query, isDataEmpty],
  );

  const boundComponents = useMemo(() => {
    return {
      Empty: EmptyComponent,
      Error: ErrorComponent,
      Loading: LoadingComponent,
      Success: SuccessComponent as unknown as FC<SuccessProps<TData>>,
    };
  }, []);

  return (
    <QueryBoundaryContext.Provider
      value={contextValue as QueryBoundaryContextValue<unknown, unknown>}
    >
      {typeof children === "function" ? children(boundComponents) : children}
    </QueryBoundaryContext.Provider>
  );
}

QueryBoundary.Loading = LoadingComponent;
QueryBoundary.Error = ErrorComponent;
QueryBoundary.Empty = EmptyComponent;
QueryBoundary.Success = SuccessComponent;
