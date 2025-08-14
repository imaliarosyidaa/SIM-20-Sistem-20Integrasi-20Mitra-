import React from "react";
import { HotTable } from "@handsontable/react";

const ExampleComponent: React.FC = () => {
  const data = [
    ["", "Tesla", "Nissan", "Toyota", "Honda", "Mazda", "Ford"],
    ["2017", 10, 11, 12, 13, 15, 16],
    ["2018", 10, 11, 12, 13, 15, 16],
    ["2019", 10, 11, 12, 13, 15, 16],
    ["2020", 10, 11, 12, 13, 15, 16],
    ["2021", 10, 11, 12, 13, 15, 16],
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contoh Tabel Handsontable
      </h3>
      <HotTable
        data={data}
        rowHeaders={true}
        colHeaders={true}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        className="htCore"
      />
    </div>
  );
};

export default ExampleComponent;
