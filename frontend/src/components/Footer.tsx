import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6 text-center border-t border-gray-300">
      <Typography variant="body2" className="!text-gray-700">
        &copy; 2025 AI Note Summarizer
      </Typography>
      <ul className="flex justify-center space-x-6 mt-2">
        {["About Us", "License", "Contribute", "Contact Us"].map((text) => (
          <li key={text}>
            <Typography
              component="a"
              href="#"
              className="!text-sky-900 !transition-colors !hover:text-sky-900"
            >
              {text}
            </Typography>
          </li>
        ))}
      </ul>
    </footer>
  );
}
