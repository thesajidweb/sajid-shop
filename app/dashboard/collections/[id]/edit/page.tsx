import CollectionForm from "@/components/forms/collection-Form/CollectionForm";

import CollectionFormSkeleton from "./loading";
import { getSingleCollection } from "@/lib/actions/collection/getSingleCollection";
import ErrorBox from "@/components/shared/ErrorBox";

interface Props {
  params: Promise<{ id: string }>;
}

const EditCollection = async ({ params }: Props) => {
  const { id } = await params;
  const res = await getSingleCollection(id);
  if (!res.success) {
    return (
      <ErrorBox
        title="Failed to fetch collection details"
        message={res.error}
      />
    );
  }

  const initialData = res.data;

  if (!res) {
    return <CollectionFormSkeleton />;
  }
  return (
    <div className="container mx-auto py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <CollectionForm initialData={initialData ?? undefined} />
      </div>
    </div>
  );
};

export default EditCollection;
