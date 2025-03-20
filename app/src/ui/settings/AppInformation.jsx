export const AppInformation = () => {
  return (
    <div className="text-center max-w-[1000px] ms-auto me-auto">
      <i>bus?</i>
      <span className="bg-blue-600 px-3 py-1 rounded-md ms-1 me-1">v2</span>
      .&nbsp; Made by Tan (weareblahs).{" "}
      <span className="underline">View source code</span>
      <br />
      Static and realtime data for rapidPenang, rapidKL and rapidPahang buses
      sourced from Prasarana's GTFS endpoints via data.gov.my which its terms
      can be viewed{" "}
      <a
        href="https://archive.data.gov.my/p/terma-pengguna"
        className="underline"
      >
        here
      </a>{" "}
      (in Malay).
    </div>
  );
};
