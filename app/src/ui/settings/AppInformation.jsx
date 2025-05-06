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
      which is used under{" "}
      <a href="https://developer.data.gov.my/faq" className="underline">
        CC BY 4.0
      </a>
      . &nbsp; Map data &copy;{" "}
      <a href="https://openstreetmap.org" className="underline">
        OpenStreetMap
      </a>{" "}
      Contributors. Retrieved via{" "}
      <a href="http://nominatim.openstreetmap.org/" className="underline">
        Nominatim
      </a>
      .
      <br />
      <b>Do note that data could be inaccurate for realtime data</b>. Please
      check official sources, such as myRapid PULSE for accurate realtime data
      information.
    </div>
  );
};
