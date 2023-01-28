import {
  HuddleClientProvider,
  getHuddleClient,
} from "@huddle01/huddle01-client";
import Layout from "../components/layouts/Layout";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);

  return (
    <HuddleClientProvider client={huddleClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </HuddleClientProvider>
  );
}
