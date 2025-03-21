export const AppInformation = () => {
  return (
    <div className="text-center max-w-[1000px] ms-auto me-auto">
      <i>bus?</i>
      <span className="bg-blue-600 px-3 py-1 rounded-md ms-1 me-1">v2</span>
      .&nbsp; Made by Tan (weareblahs).{" "}
      <a className="underline" href="https://github.com/weareblahs/bus">
        View source code
      </a>
      <br />
      Static and realtime data for rapidPenang, rapidKL and rapidPahang buses
      sourced from{" "}
      <a
        href="https://developer.data.gov.my/realtime-api/gtfs-static#prasarana"
        className="underline"
      >
        Prasarana's GTFS endpoints via data.gov.my
      </a>{" "}
      which its terms can be viewed{" "}
      <a
        href="https://archive.data.gov.my/p/terma-pengguna"
        className="underline"
      >
        here
      </a>{" "}
      (in Malay).&nbsp; 
      <b>Do note that data could be inaccurate for realtime data</b>. Please
      check official sources, such as myRapid PULSE for accurate realtime data
      information.
    </div>
  );
};
