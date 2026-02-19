import { useNavigate, useLocation, useParams } from 'react-router-dom';

// A small shim providing a Next.js-like `useRouter` API backed by react-router-dom.
// This is intentionally minimal: it implements the subset of the API used across
// the codebase (push, replace, pathname, asPath, query, params).
export type NextRouter = {
  push: (url: string, options?: { replace?: boolean }) => void | Promise<void>;
  replace: (url: string) => void | Promise<void>;
  pathname: string;
  asPath: string;
  query: Record<string, string>;
  params: Record<string, string>;
  back: () => void;
  reload: () => void;
  route?: string;
};

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const push = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) return navigate(path, { replace: true });
    return navigate(path);
  };

  const replace = (path: string) => navigate(path, { replace: true });

  const back = () => window.history.back();
  const reload = () => window.location.reload();

  // route is a Next-like property often used to read the current route pattern
  const route = location.pathname;

  const asPath = location.pathname + location.search;

  const query = Object.fromEntries(new URLSearchParams(location.search));

  return {
    push,
    replace,
    pathname: location.pathname,
    asPath,
    query,
    params,
    back,
  reload,
    route,
  } as const;
}

export default useRouter;
