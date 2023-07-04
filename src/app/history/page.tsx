"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, type GameHistory } from "@/app/state/storage";
import { Timer } from "../components/Timer";
import styles from "./page.module.css";

export default function History() {
  const [history, setHistory] = useState<GameHistory>([]);

  useEffect(() => {
    setHistory(getHistory() ?? []);
  }, []);

  return (
    <main>
      <h2>History</h2>
      <table className={styles.history}>
        <caption>History of games played</caption>
        <thead>
          <tr>
            <th>Quote</th>
            <th>Author</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {history?.map((game) => (
            <tr key={game.id}>
              <td>
                <Link href={`/view/${game.id}`}>{game.quote}</Link>
              </td>
              <td>{game.author}</td>
              <td>
                {game.win ? (
                  <Timer ms={game.msElapsed} />
                ) : (
                  <span title="You gave up">
                    (<Timer ms={game.msElapsed} />)
                  </span>
                )}
              </td>
              <td>{new Date(game.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
