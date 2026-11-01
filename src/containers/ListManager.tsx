import Layout from "../components/Layout";
import List from "../components/List";
import Loading from "../components/Loading";
import useFetch from "../hooks/useFetch";
import { ImageData, ListResponse } from "../types";

interface ListManagerProps extends ImageData {
  path: string;
}

export default function ListManager({
  path,
  isRetina,
  supportsWebp
}: ListManagerProps) {
  const currentUrl = path ? `/list/${path}` : "";
  const encodedPath = path ? `/${encodeURIComponent(path)}` : "";
  const { data, loading, error, retry } = useFetch<ListResponse>(
    `list${encodedPath}`
  );

  return (
    <Layout
      url={currentUrl}
      current={data ? data.dir : null}
      parent={data ? data.parent : null}
    >
      {loading && <Loading inline />}
      {!!error && (
        <>
          An error occured while loading this page
          <br />
          <button className="Button" onClick={retry}>
            Retry
          </button>
        </>
      )}
      {data && !loading && (
        <List
          books={data.books}
          isRetina={isRetina}
          supportsWebp={supportsWebp}
        />
      )}
    </Layout>
  );
}
