export const DataRefresh = () => {
  setInterval(() => {
    if (JSON.stringify(localStorage.getItem("routeData")).length != 0) {
      window.location.reload();
    }
  }, 2000);
  return (
    <div
      className="flex"
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <div className="block text-center">
        <h1 className="text-6xl/none">
          Please wait while the app downloads route data...
        </h1>
        <h4 className="text-2xl/tight">
          This is a one-time process after you change or select a bus provider.
          After this process, it will save route data to your device. To refresh
          bus data, go to Settings.
        </h4>
        <h4 className="text-2xl/tight italic">
          Stuck in this screen?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Refresh
          </span>
        </h4>
      </div>
    </div>
  );
};
