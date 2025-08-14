import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';

export default function MyTable() {
  return (
    <HotTable
      data={[
        ['', 'Tesla', 'Nissan'],
        ['2019', 10, 11],
        ['2020', 20, 22],
      ]}
      colHeaders={true}
      rowHeaders={true}
      licenseKey="non-commercial-and-evaluation"
    />
  );
}
