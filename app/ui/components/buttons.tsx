import clsx from 'clsx';
import Link from 'next/link';

export function ActionButton({
  action,
  icon,
  url,
}: {
  action?: () => void;
  icon: JSX.Element;
  url?: string;
}) {
  if (url) {
    return (
      <Link href={url} className="rounded-md border p-2 hover:bg-gray-100">
        {icon}
      </Link>
    );
  }

  const btn = (
    <button className="rounded-md border p-2 hover:bg-gray-100">{icon}</button>
  );

  return action ? <form action={action}>{btn}</form> : btn;
}

export function PrimaryButton({
  icon,
  onClick,
  title,
  url,
}: {
  icon: JSX.Element;
  onClick?: () => void;
  title: string;
  url?: string;
}) {
  const defaultClassName =
    'flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  const buttonElement = (
    <>
      {title ? <span className="hidden md:block">{title}</span> : null}
      {icon}
    </>
  );

  return url ? (
    <Link href={url} className={clsx(defaultClassName)}>
      {buttonElement}
    </Link>
  ) : (
    <button className={clsx(defaultClassName)} onClick={onClick}>
      {buttonElement}
    </button>
  );
}
