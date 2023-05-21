const MainFooter = () => (
  <footer className="fixed bottom-0 w-full py-6 text-center md:py-4">
    <div>
      <p className="text-center text-lg">
        Copyright © {new Date().getFullYear()}
        <a
          href="https://edwardcs.com"
          className="text-green-500"
          target="_blank"
        >
          {" "}
          Edward Savin
        </a>
      </p>
    </div>
  </footer>
);

export default MainFooter;
