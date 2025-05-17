import Authenticate from "../components/auth/authenticate/Authenticate";

export default function Home() {
  return (
    <main>
      <h1>Welcome to Scamzap</h1>
      <Authenticate />
      <a href="/learn/internet-security">
        Start Learning
      </a>
    </main>
  );
}
