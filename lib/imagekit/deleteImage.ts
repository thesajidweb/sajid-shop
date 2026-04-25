// this is client component I use it to delete images in client components
export const DeleteServerImages = async (fileIds: string[]) => {
  try {
    const res = await fetch("/api/image/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileIds }),
    });

    if (!res.ok) throw new Error("Failed to delete image");
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message);
  }
};
