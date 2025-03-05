import ImageEditorComponent from "@/components/imageEditorComponent";

export default function UploadImage() {
  return (
    <div className="text-3xl">
      Upload image
      <br />
      <br />
      <ImageEditorComponent image={"/noprofilepic.webp"} />
    </div>
  );
}
