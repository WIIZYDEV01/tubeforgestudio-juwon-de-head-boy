export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12">
      <div className="h-4 w-32 bg-line" />
      <div className="mt-6 h-16 w-2/3 max-w-xl bg-line" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="aspect-video bg-line" />
        <div className="aspect-video bg-line" />
        <div className="aspect-video bg-line" />
      </div>
    </div>
  );
}
