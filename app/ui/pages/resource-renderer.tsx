'use client';

import clsx from 'clsx';
import { Key } from 'react';

export type TableHeader = {
  children: JSX.Element;
  className?: string;
  key?: Key;
};

export type CardProps = {
  upperPanel?: JSX.Element;
  lowerPanel?: JSX.Element;
};

export type TableDataProps = {
  children: JSX.Element;
  className?: string;
  key?: Key;
};

export type ResourceRendererProps = {
  tableHeaders?: TableHeader[];
  // cardMapper
  // tableRowMapper
  resources: {
    action?: JSX.Element;
    card?: CardProps;
    cols?: TableDataProps[];
    key?: Key;
  }[];
};

export default function ResourceRenderer(props: ResourceRendererProps) {
  const hasAction = props.resources.some((row) => !!row.action);
  const hasCardView = !props.resources.some((row) => !row.card);
  const hasTableView = !props.resources.some((row) => !row.cols);

  return (
    <>
      {hasCardView ? (
        <div className={clsx({ 'md:hidden': hasTableView })}>
          {props.resources.map((row) => (
            <div key={row.key} className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                {row.card!.upperPanel}
              </div>
              <div className="flex w-full items-center justify-between pt-4">
                {row.card!.lowerPanel}
                {hasAction ? (
                  <div className="flex justify-end gap-2">{row.action}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {hasTableView ? (
        <table
          className={clsx(
            'min-w-full text-gray-900',
            hasCardView ? 'hidden md:table' : 'table',
          )}
        >
          {props.tableHeaders ? (
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {props.tableHeaders.map((header, idx) => (
                  <th
                    key={`${idx}`}
                    scope="col"
                    className={clsx(
                      idx > 1
                        ? 'px-3 pb-5 pt-4 font-medium'
                        : 'px-4 pb-5 pt-4 font-medium sm:pl-6',
                      header.className,
                    )}
                  >
                    {header.children}
                  </th>
                ))}
                {hasAction ? (
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                ) : null}
              </tr>
            </thead>
          ) : null}
          <tbody className="bg-white">
            {props.resources.map((row) => (
              <tr
                key={row.key}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                {row.cols!.map((col, idx) => (
                  <td
                    key={col.key}
                    className={clsx(
                      'whitespace-nowrap',
                      idx > 1 ? 'px-3 py-3' : 'py-3 pl-6 pr-3',
                      col.className,
                    )}
                  >
                    {col.children}
                  </td>
                ))}
                {hasAction ? (
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">{row.action}</div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
