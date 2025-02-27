export default function BlueButton({ children }) {
  return (
    <div>
      <div className="cursor-pointer w-max py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
        {children}
      </div>
    </div>
  );
}
