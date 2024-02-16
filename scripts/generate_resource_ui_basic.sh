#!/bin/bash

# # Get user input for file name and location
# read -p "Enter desired file name (e.g., index.js): " filename
# read -p "Enter file location (relative to project root): " location
read -p "Enter desired resource name in singular form (e.g., Customer): " singular_noun
read -p "Enter desired resource name in plural form (e.g., Customers): " plural_noun
read -p "Enter directory name for resource (e.g., customers): " resource_dir

# # Construct full file path
# filepath="$PWD/$location/$filename"
app_dir="$PWD/app/dashboard/$resource_dir"
app_index_path="$app_dir/page.tsx"
app_create_path="$app_dir/create/page.tsx"
app_edit_path="$app_dir/edit/[id]/page.tsx"

ui_dir="$PWD/app/ui/$resource_dir"
ui_delete_modal_path="$ui_dir/delete-modal.tsx"
ui_form_path="$ui_dir/form.tsx"
ui_resource_renderer_path="$ui_dir/resource-renderer.tsx"

action_filepath="$PWD/app/lib/actions.ts"
data_filepath="$PWD/app/lib/data.ts"

# ===== APP =====

# Create file and write content
if [[ ! -d "$app_dir" ]]; then
  mkdir -p "$app_dir"
fi

# ===== APP_INDEX =====

if [[ -f "$app_index_path" ]]; then
  read -p "File already exists. Overwrite? (y/N): " answer
  if [[ "$answer" != "y" ]]; then
    exit 1
  fi
fi

echo "Generating $app_index_path ..."

# Define file template content
app_index_template="""
import { Metadata } from 'next';
import { fetch$(plural_noun)Pages, fetchFiltered$(plural_noun) } from '@/app/lib/data';
import { $(plural_noun)TableType } from '@/app/lib/definitions';
import ResourceIndex, {
  ResourceIndexSearchParamsType,
} from '@/app/ui/pages/resource-index';
import render$(plural_noun), {
  DeleteModalSearchParamsType,
} from '@/app/ui/$(resource_dir)/resource-renderer';

export const metadata: Metadata = {
  title: '$(plural_noun)',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: ResourceIndexSearchParamsType & DeleteModalSearchParamsType;
}) {
  return (
    <ResourceIndex<$(plural_noun)TableType>
      createButtonTitle=\"Create $(singular_noun)\"
      createButtonUrl=\"/dashboard/$(resource_dir)/create\"
      fetchFilteredResources={fetchFiltered$(plural_noun)}
      fetchResourcesPages={fetch$(plural_noun)Pages}
      page={searchParams?.page}
      query={searchParams?.query}
      renderResources={($(resource_dir)) => render$(plural_noun)($(resource_dir), searchParams)}
      searchPlaceholder=\"Search $(resource_dir)...\"
      title=\"$(plural_noun)\"
    />
  );
}
"""

echo "$app_index_template" > "$app_index_path"
echo "File '$app_index_path' generated successfully."

# ===== APP_CREATE =====

if [[ -f "$app_create_path" ]]; then
  read -p "File already exists. Overwrite? (y/N): " answer
  if [[ "$answer" != "y" ]]; then
    exit 1
  fi
fi

echo "Generating $app_create_path ..."

# Define file template content
app_create_template="""
import Form from '@/app/ui/$(resource_dir)/form';
import Breadcrumbs from '@/app/ui/components/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '$(plural_dir)', href: '/dashboard/$(resource_dir)' },
          {
            label: 'Create $(singular_dir)',
            href: '/dashboard/$(resource_dir)/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
"""

echo "$app_create_template" > "$app_create_path"
echo "File '$app_create_path' generated successfully."

# ===== APP_EDIT =====

if [[ -f "$app_edit_path" ]]; then
  read -p "File already exists. Overwrite? (y/N): " answer
  if [[ "$answer" != "y" ]]; then
    exit 1
  fi
fi

echo "Generating $app_edit_path ..."

# Define file template content
app_edit_template="""
import Form from '@/app/ui/$(resource_dir)/form';
import Breadcrumbs from '@/app/ui/$(resource_dir)/breadcrumbs';
import { fetch$(singular_noun)ById } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [resource] = await Promise.all([
    fetch$(singular_noun)ById(id),
  ]);

  if (!resource) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '$(plural_noun)', href: '/dashboard/$(resource_dir)' },
          {
            label: 'Edit $(singular_noun)',
            href: \`/dashboard/$(resource_dir)/\${id}/edit\`,
            active: true,
          },
        ]}
      />
      <Form defaultForm={{
        ...resource
      }} />
    </main>
  );
}
"""

echo "$app_edit_template" > "$app_edit_path"
echo "File '$app_edit_path' generated successfully."

# ===== UI_DELETE_MODAL =====

if [[ -f "$ui_delete_modal_path" ]]; then
  read -p "File already exists. Overwrite? (y/N): " answer
  if [[ "$answer" != "y" ]]; then
    exit 1
  fi
fi

echo "Generating $ui_delete_modal_path ..."

# Define file template content
ui_delete_modal_template="""
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { PrimaryButton } from '@/app/ui/components/buttons';
import Image from 'next/image';
import Modal from '@/app/ui/components/modal';

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
      replace(\`${pathname}?${params.toString()}\`);
    }, 200);
    replace(\`${pathname}?${params.toString()}\`);
  };

  return (
    <Modal title={\`Delete\`} open={props.open} onClose={closeModal}>
      <div className=\"mt-2\">
        <p className=\"text-sm text-gray-500\">
          Are you sure you want to delete ?
        </p>
        <p className=\"text-sm text-gray-500\">
          **This action cannot be undone.**
        </p>
      </div>

      <div className=\"mt-4\">
        <PrimaryButton
          icon={<TrashIcon className=\"h-5 md:ml-4\" />}
          onClick={() => {
            closeModal();
          }}
          title={\`Delete\`}
        />
      </div>
    </Modal>
  );
}

"""

echo "$ui_delete_modal_template" > "$ui_delete_modal_path"
echo "File '$ui_delete_modal_path' generated successfully."
