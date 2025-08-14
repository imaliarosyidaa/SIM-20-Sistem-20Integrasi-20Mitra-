// src/components/ExampleComponent.jsx

import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';

// Import CSS dari Handsontable


// Daftarkan semua module Handsontable
registerAllModules();

const ExampleComponent = () => {
  return (
    <HotTable
      data={[
        ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
        ['2017', 10, 11, 12, 13, 15, 16],
        ['2018', 10, 11, 12, 13, 15, 16],
        ['2019', 10, 11, 12, 13, 15, 16],
        ['2020', 10, 11, 12, 13, 15, 16],
        ['2021', 10, 11, 12, 13, 15, 16],
      ]}
      rowHeaders
      colHeaders
      contextMenu
      height="auto"
      autoWrapRow
      autoWrapCol
      licenseKey="non-commercial-and-evaluation"
    />
  );
};

export default ExampleComponent;
