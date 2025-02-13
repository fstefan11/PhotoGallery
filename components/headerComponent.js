export default function Header() {
  return (
    <nav>
      <div className="flex border-b px-8 py-5 justify-between">
        <div>PhotoGallery</div>
        <ul className="flex flex-col md:flex-row gap-4">
          <li>Photos</li>
          <li>Categories</li>
          <li>Users</li>
          <li>Sign In</li>
          <li>Register</li>
        </ul>
      </div>
    </nav>
  );
}
