import React from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

interface HottableProps {
  data: any[];
  columns?: any[];
  colHeaders?: boolean | string[];
  rowHeaders?: boolean;
  width?: string | number;
  height?: string | number;
  stretchH?: 'none' | 'last' | 'all';
  className?: string;
  readOnly?: boolean;
  [key: string]: any;
}

const Hottable: React.FC<HottableProps> = ({
  data,
  columns,
  colHeaders = true,
  rowHeaders = true,
  width = '100%',
  height = 'auto',
  stretchH = 'all',
  className = '',
  readOnly = false,
  ...otherProps
}) => {
  return (
    <div className={`handsontable-wrapper ${className}`}>
      <HotTable
        data={data}
        columns={columns}
        colHeaders={colHeaders}
        rowHeaders={rowHeaders}
        width={width}
        height={height}
        stretchH={stretchH}
        readOnly={readOnly}
        licenseKey="non-commercial-and-evaluation"
        {...otherProps}
      />
    </div>
  );
};

export default Hottable;
