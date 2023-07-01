import Link from "next/link";
import Quote from "@/app/components/Quote";

type ViewParams = {
  id: string;
};

type ViewProps = {
  params: ViewParams;
};

// const domain = "cryptoquote-five.vercel.app";
const domain = "cryptoquote-git-feat-48-og-meta-rykus0.vercel.app";

export async function generateMetadata(props: ViewProps) {
  const { content, author } = await getData(props.params.id);

  return {
    openGraph: {
      title: `Quote by ${author}`,
      description: content,
      url: `https://${domain}/view/${props.params.id}`,
      type: "website",
      images: [
        {
          url: `https://${domain}/screenshot?id=${props.params.id}`,
          alt: `${content} - ${author}`,
        },
      ],
    },
  };
}

export default async function View(props: ViewProps) {
  const { content, author } = await getData(props.params.id);

  return (
    <main>
      <Quote quote={content} author={author} />
      <p>
        <Link href="/">Play</Link>
      </p>
    </main>
  );
}

async function getData(id: string) {
  const response = await fetch(`https://api.quotable.io/quotes/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`The specified quote was not found`);
    }

    throw new Error(
      `Error code ${response.status} while fetching quote. ${response.statusText}`
    );
  }

  return response.json();
}
