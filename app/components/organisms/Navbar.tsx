import { MdHome } from "react-icons/md";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="sticky top-0 right-0 left-0 flex items-center justify-between p-4">
      <Link
        to="/"
        className="hover:text-accent-2 flex items-center gap-2 transition duration-150 hover:cursor-pointer"
      >
        <MdHome size={20} />
        Main Menu
      </Link>
      <div>Github</div>
    </nav>
  );
};

export default Navbar;
