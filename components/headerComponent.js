import Link from "next/link";

export default function Header() {
  return (
    <nav>
      <div className="flex border-b px-8 py-5 justify-between">
        <div>
          <Link href={"/"}>PhotoGallery</Link>
        </div>
        <ul className="flex flex-col md:flex-row gap-4">
          <li>Photos</li>
          <li>Categories</li>
          <li>Users</li>
          <li>
            <Link href={"/login"}>Log In</Link>
          </li>
          <li>
            <Link href={"/register"}>Register</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
