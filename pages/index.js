import Head from "next/head";
import styles from "../styles/Home.module.css";
import { orderBy, filter } from "lodash";
import Trend from "react-trend";

function isOdd(n) {
  return Math.abs(n % 2) == 1;
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dengue Tracker - SG</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Dengue Tracker</h1>

        <p className={styles.description}>
          Last week we had <strong className={styles.code}>{props.latestNo}</strong>
          cases, thats <strong className={styles.code}>{props.change}</strong>{" "}
          {props.change > 0 ? "less" : "more"} than last week.
        </p>
        <Trend
          smooth
          autoDraw
          autoDrawDuration={10000}
          autoDrawEasing="ease-out"
          data={props.numbers.reverse()}
          gradient={["#eb1e58"]}
          radius={10}
          strokeWidth={2}
          strokeLinecap={"round"}
        />
      </main>
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
      numbers.push(cases[week]['no._of_cases'] / 100 );
    }
  }

  console.log(numbers)
  console.log(weeks);
  console.log(weeks[1]["no._of_cases"] - weeks[0]["no._of_cases"]);
  return {
    props: {
      cases: weeks,
      numbers: numbers,
      latestNo: weeks[0]["no._of_cases"],
      change: weeks[1]["no._of_cases"] - weeks[0]["no._of_cases"],
    },
    revalidate: 500
  };
}
