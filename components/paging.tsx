import React from 'react';
import Link from '@mui/material/Link';

import { CONSTANTS } from 'lib/constants';

export type Props = {
  totalCount: number;
};

export default function Paging(props: Props) {
  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);
  const { totalCount } = props;
  return (
    <ul className="list-none flex justify-center">
      {range(1, Math.ceil(totalCount / CONSTANTS.PER_PAGE)).map(
        (number, index) => (
          <li className="m-2" key={index}>
            <div className="rounded border border-black-500 border-solid">
              <Link href={`/page/${number}`} underline="hover">
                {number}
              </Link>
            </div>
          </li>
        )
      )}
    </ul>
  );
}
