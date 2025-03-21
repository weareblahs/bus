export const DataCard = ({ singleData }) => {
  console.log(singleData);
  return (
    <div className="bg-black dark:bg-white text-white dark:text-black w-[100%] mt-2 mb-2 rounded-md p-2">
      <div className="grid grid-cols-4">
        <div className="col-span-1">{singleData.vehicle_plate}</div>
        <div className="text-end col-span-3">
          <span className="bg-green-600 px-2 py-1 rounded-xl text-sm text-white ">
            currently on {singleData.vehicle_speed}km/h
          </span>
        </div>
      </div>
    </div>
  );
};
