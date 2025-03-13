import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NewspaperTwoToneIcon from "@mui/icons-material/NewspaperTwoTone";

export default function Navbar() {
  return (
    <AppBar position="static" className="!bg-sky-900 !shadow-md">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="!flex !items-center">
          <NewspaperTwoToneIcon className="!text-white !mr-2" />
          <Typography
            variant="h6"
            component="a"
            href="/"
            className="!text-white !font-mono !font-bold !tracking-widest !no-underline"
          >
            AI Note Summarizer
          </Typography>
          <Typography
            variant="h6"
            component="a"
            href="/notes"
            className="!text-white !font-mono !font-bold !tracking-widest !no-underline !ml-auto"
          >
            Saved notes
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
