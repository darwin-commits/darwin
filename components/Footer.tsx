import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p> &copy; {currentYear} Darwin Kolisi. All rights reserved.</p>
    </footer>
  );
}