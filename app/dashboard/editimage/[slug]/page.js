import BlueButton from "@/components/blueButtonComponent";
import { getPhotoById } from "@/lib/actions/photoActions";
import { notFound } from "next/navigation";

export default async function ({ params }) {
  const slug = (await params).slug;
  const response = await getPhotoById(slug);
  if (!response.success) return <div>Not found!</div>;
  const image = response.image;
  return (
    <div>
      <div className="text-3xl text-center">{image.title}</div>
      <div className="mt-20 mb-10 flex flex-col xl:flex-row xl:gap-24">
        <div className="xl:w-1/2 justify-center">
          <img
            src={image.url}
            alt={image.title}
            className="max-w-full max-h-[700px] object-contain"
          />
          <br />
          <div>{image.description}</div>
        </div>
        <form className="xl:w-1/2">
          <div>
            <div className="w-full mb-6">
              <label className="block mb-2">Title</label>
              <input
                name="title"
                type="text"
                placeholder="Enter Title"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              />
            </div>
            <div className="w-full mb-6">
              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                type="textarea"
                placeholder="Enter Description"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
              />
            </div>
            <div className="w-full mb-6 flex items-center gap-3">
              <input
                type="checkbox"
                id="private"
                name="private"
                className="w-5 h-5"
              />
              <label htmlFor="private" className="text-gray-800">
                Private
              </label>
            </div>
          </div>
          <button type="submit">
            <BlueButton>
              <div className="flex gap-6 items-center">Edit</div>
            </BlueButton>
          </button>
        </form>
      </div>
    </div>
  );
}
