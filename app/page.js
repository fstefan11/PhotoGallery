import BlueButton from "@/components/blueButtonComponent";
import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <div className="text-center p-6">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to PhotoGallery
        </h1>
        <p className="text-xl mb-6">
          Share and discover beautiful photos with the world.
        </p>
      </div>

      <div className="w-full px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Share Your Moments</h2>
              <p className="text-lg">
                PhotoGallery is a platform where you can upload your favourite
                images and share them with friends, family, and fellow
                photography enthusiasts. Whether you're a photographer or just
                love snapping pics, this is the place to showcase your
                creativity.
              </p>
              <p className="text-lg">
                Discover incredible photography from people around the world,
                comment on your favourites, and show your appreciation with
                likes.
              </p>
              <div className="mt-8">
                <Link href={"/register"}>
                  <BlueButton>Start Exploring</BlueButton>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[400px]">
            <img
              src="./landscape.jpg"
              alt="Landscape"
              className="rounded-lg shadow-xl object-cover w-full h-full"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-lg"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center">
              <h3 className="text-white text-3xl font-semibold z-10">
                Showcase Your Creativity
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
