import comicsIndex from "../../../server/comics";
import { getValidSession } from "../../auth";
import Layout from "../../components/Layout";

export default async function Page() {
  await getValidSession();
  const errors = comicsIndex.errors;

  return (
    <Layout current={{ name: "Errors" }}>
      <ol>
        {errors.length === 0 && (
          <li>No error while indexing, enjoy all your books !</li>
        )}
        {errors.map((item) => {
          return (
            <li key={item[0]}>
              <strong>{item[0]}</strong>
              <br />
              <p>{item[1].message}</p>
              <pre>{item[1].stack}</pre>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
}
