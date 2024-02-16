'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from '@/app/ui/components/buttons';
import Modal from '@/app/ui/components/modal';

export const useResourceDeleteModal = (configs: {
  resourceSearchParamKeys: string[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('openDeleteModal');
    setTimeout(() => {
      configs.resourceSearchParamKeys.forEach(key => {
        params.delete(key);
      });
      replace(`${pathname}?${params.toString()}`);
    }, 200);
    replace(`${pathname}?${params.toString()}`);
  };

  return {
    closeModal,
    open: searchParams.get('openDeleteModal') == 'true',
  }
}

export default function ResourceDeleteModal(props: {
  children: React.ReactNode;
  closeModal: () => void;
  open: boolean;
}) {
  return (
    <Modal title={`Delete`} open={props.open} onClose={props.closeModal}>
      {props.children}

      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete ?
        </p>
        <p className="text-sm text-gray-500">
          **This action cannot be undone.**
        </p>
      </div>

      <div className="mt-4">
        <PrimaryButton
          icon={<TrashIcon className="h-5 md:ml-4" />}
          onClick={() => {
            props.closeModal();
          }}
          title={`Delete`}
        />
      </div>
    </Modal>
  );
}
