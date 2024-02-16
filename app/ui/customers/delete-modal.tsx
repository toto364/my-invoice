'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from '@/app/ui/components/buttons';
import Image from 'next/image';
import Modal from '@/app/ui/components/modal';
import ResourceDeleteModal from '../pages/resource-delete-modal';

// export const useDeleteModal = ({
//   resourceKeys
// } : {
//   resourceKeys: string[]
// }) => {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const { replace } = useRouter();

//   const closeModal = () => {
//     const params = new URLSearchParams(searchParams);
//     params.delete('openDeleteModal');
//     setTimeout(() => {
//       resourceKeys.map(key => {
//         params.delete(key);
//       })
//       replace(`${pathname}?${params.toString()}`);
//     }, 200);
//     replace(`${pathname}?${params.toString()}`);
//   };

//   return {
//     closeModal,
//   }
// }

export default function DeleteModal(props: {
  open: boolean;
  customerEmail?: string;
  customerImageUrl?: string;
  customerName?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('openDeleteModal');
    setTimeout(() => {
      params.delete('customerEmail');
      params.delete('customerImageUrl');
      params.delete('customerName');
      replace(`${pathname}?${params.toString()}`);
    }, 200);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ResourceDeleteModal
      open={open}
    >
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <Image
            src={props.customerImageUrl || ''}
            className="rounded-full"
            alt={`${props.customerName}'s profile picture`}
            width={28}
            height={28}
          />
          <p>{props.customerName}</p>
          <p className="text-sm text-gray-500">{props.customerEmail}</p>
        </div>
      </div>
    </ResourceDeleteModal>
    // <Modal title={`Delete`} open={props.open} onClose={closeModal}>
    //   <div className="mt-4">
    //     <div className="flex items-center gap-3">
    //       <Image
    //         src={props.customerImageUrl || ''}
    //         className="rounded-full"
    //         alt={`${props.customerName}'s profile picture`}
    //         width={28}
    //         height={28}
    //       />
    //       <p>{props.customerName}</p>
    //       <p className="text-sm text-gray-500">{props.customerEmail}</p>
    //     </div>
    //   </div>

    //   <div className="mt-2">
    //     <p className="text-sm text-gray-500">
    //       Are you sure you want to delete ?
    //     </p>
    //     <p className="text-sm text-gray-500">
    //       **This action cannot be undone.**
    //     </p>
    //   </div>

    //   <div className="mt-4">
    //     <PrimaryButton
    //       icon={<TrashIcon className="h-5 md:ml-4" />}
    //       onClick={() => {
    //         closeModal();
    //       }}
    //       title={`Delete`}
    //     />
    //   </div>
    // </Modal>
  );
}
