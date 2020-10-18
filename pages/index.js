import Head from "next/head";
import styles from "../styles/Home.module.css";
import { orderBy, filter } from "lodash";

function isOdd(n) {
  return Math.abs(n % 2) == 1;
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Dengue Tracker</h1>

        <p className={styles.description}>
          Last week we had <code className={styles.code}>{props.latestNo}</code>
          cases, thats {props.change} {props.change > 0 ? "less" : "more"} than
          last week.
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps(context) {
  const cases = await fetch(
    "https://data.gov.sg/api/action/datastore_search?resource_id=ef7e44f1-9b14-4680-a60a-37d2c9dda390&q=Dengue&limit=4000"
  )
    .then((r) => r.json())
    .then((cases) => cases.result.records)
    .then((cases) => filter(cases, (week) => week.disease === "Dengue Fever"))
    .then((cases) => filter(cases, (week) => week.epi_week.includes("2020")))
    .then((cases) => orderBy(cases, "epi_week", "desc"));

  const weeks = [];

  const numbers = [];

  for (var week in cases) {
    if (!isOdd(week)) {
      weeks.push(cases[week]);
    }
  }
  console.log(weeks);
  console.log(weeks[1]["no._of_cases"] - weeks[0]["no._of_cases"]);
  return {
    props: {
      cases: weeks,
      latestNo: weeks[0]["no._of_cases"],
      change: weeks[1]["no._of_cases"] - weeks[0]["no._of_cases"],
    },
  };
}
