export default function RedButton({ children }) {
  return (
    <div>
      <div className="cursor-pointer w-max py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none">
        {children}
      </div>
    </div>
  );
}
