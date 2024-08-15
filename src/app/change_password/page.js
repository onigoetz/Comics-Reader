import React from "react";

import Layout from "../../components/Layout";

export default async function Page() {
  return (
    <Layout current={{ name: "Change Password" }}>
        <ChangePasswordForm />
    </Layout>
  );
}

