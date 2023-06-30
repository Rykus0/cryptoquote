import Placeholder from "@/app/components/Placeholder";

export default function ViewLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "1em",
        rowGap: "0.5em",
      }}
    >
      <Placeholder height="4em" />
      <Placeholder height="4em" />
      <Placeholder height="4em" />
    </div>
  );
}
