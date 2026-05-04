import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <h1>Wash World App</h1>

      <p>
        Se dine vaske, find nærmeste vaskehal og følg hvor meget du sparer med dit abonnement.
      </p>

      <div className="buttons">
        <Link href="/sign-up">Opret bruger</Link>
        <Link href="/login">Login</Link>
        <Link href="/locations">Find vaskehal</Link>
      </div>
    </main>
  );
}