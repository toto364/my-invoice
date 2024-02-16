'use client';

import Image from 'next/image';
import ResourceDeleteModal, { useResourceDeleteModal } from '../pages/resource-delete-modal';
import { useSearchParams } from 'next/navigation';

const SEARCH_PARAM_KEYS = [
  'customerEmail',
  'customerImageUrl',
  'customerName',
];

export default function DeleteModal() {
  const searchParams = useSearchParams();
  const resourceDeleteModalVM = useResourceDeleteModal({
    resourceSearchParamKeys: SEARCH_PARAM_KEYS,
  });

  return (
    <ResourceDeleteModal {...resourceDeleteModalVM}>
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <Image
            src={searchParams.get('customerImageUrl') || ''}
            className="rounded-full"
            alt={`${searchParams.get('customerName')}'s profile picture`}
            width={28}
            height={28}
          />
          <p>{searchParams.get('customerName')}</p>
          <p className="text-sm text-gray-500">{searchParams.get('customerEmail')}</p>
        </div>
      </div>
    </ResourceDeleteModal>
  );
}
