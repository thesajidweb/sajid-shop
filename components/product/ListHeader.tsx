"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const ListHeader = () => {
  const router = useRouter();
  const onCreate = () => {
    router.push("/dashboard/products/create");
  };
  return (
    <div className="flex flex-row justify-between  sm:items-center gap-4 pt-5  md:px-6 pl-4">
      <h2 className=" text-2xl  md:text-3xl font-bold tracking-tight">
        Products Manager{" "}
      </h2>
      <Button
        onClick={onCreate}
        className="h-8 px-2 text-xs cursor-pointer mx-1"
      >
        + Add Product
      </Button>
    </div>
  );
};

export default ListHeader;
