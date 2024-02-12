'use client';

import clsx from 'clsx';
import { Key } from 'react';

export type ResourceRendererProps<T> = {
  headers?: {
    children: JSX.Element;
    className?: string;
    key?: Key;
  }[];
  resources: {
    action?: JSX.Element;
    card?: {
      upperPanel?: JSX.Element;
      lowerPanel?: JSX.Element;
    };
    cols?: {
      children: JSX.Element;
      className?: string;
      key?: Key;
    }[];
    key?: Key;
  }[];
};

export default function ResourceRenderer<T>(props: ResourceRendererProps<T>) {
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
          {props.headers ? (
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                {props.headers.map((header, idx) => (
                  <th
                    key={`${idx}`}
                    scope="col"
                    className={clsx(
                      idx > 1
                        ? 'px-3 py-5 font-medium'
                        : 'px-4 py-5 font-medium sm:pl-6',
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

// type ResourceRendererContainerProps<T> = {
//   renderResources: (resources: T[]) => JSX.Element;
//   resources: T[];
// }

// export function ResourceRendererContainer<T>(props: ResourceRendererContainerProps<T>) {
//   return props.renderResources(props.resources);
// }
