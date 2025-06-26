import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import { useSkin } from "@hooks/useSkin";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { loginPage } from "../api/loginPageApi"; // Replace with your actual API import
import "@styles/base/pages/page-misc.scss";

const Error = () => {
  const { skin } = useSkin();
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL
  const [countdown, setCountdown] = useState(3);
  const [source, setSource] = useState("");
  const [tenantExists, setTenantExists] = useState(false); // null: unknown, true: exists, false: doesn't exist

  // Extract tenant name from the subdomain
  const extractTenantFromSubdomain = () => {
    const hostname = window.location.hostname; // e.g., ranakpurjaintemple11.admin.localhost
    const subdomain = hostname.split(".")[0]; // Extract the first segment
    return subdomain || null;
  };

  const tenantName = extractTenantFromSubdomain();

  // Load the correct image based on the skin
  useEffect(() => {
    const loadImage = async () => {
      const img = await import(
        `../assets/images/pages/${
          skin === "dark" ? "error-dark.svg" : "error.svg"
        }`
      );
      setSource(img.default);
    };
    loadImage();
  }, [skin]);

  // Check if the tenant exists
  useEffect(() => {
    if (!tenantName) {
      setTenantExists(false); // No tenant in URL
      return;
    }

    const checkTenant = async () => {
      try {
        const response = await loginPage(tenantName);
        console.log(response);
        if (response && response.result) {
          setTenantExists(true);
        }
      } catch (error) {
        setTenantExists(false);
      }
      console.log(tenantExists);
    };

    checkTenant();
  }, [tenantName]);

  // Countdown and redirect logic
  useEffect(() => {
    if (tenantExists === false) {
      return; // Stop the redirect if the tenant does not exist
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    // Cleanup intervals and timeouts
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [history, tenantExists]);

  return (
    <>
      <Helmet>
        <title>Page Not Found - Apna Dharm</title>
        <meta name="description" content="The requested page was not found." />
      </Helmet>
      <div className="misc-wrapper">
        <div className="misc-inner p-2 p-sm-3">
          <div className="w-100 text-center">
            <h5
              className="mb-1"
              role="heading"
              aria-level="1"
              style={{ fontSize: "5rem", fontWeight: "bold", color: "#FF8744" }}
            >
              404
            </h5>
            <h2 className="mb-1" role="heading" aria-level="1">
              Page Not Found 🕵🏻‍♀️
            </h2>
            <p className="mb-2">
              Oops! 😖 The requested URL was not found on this server.
            </p>
            {tenantExists === false ? (
              <p className="mb-2" style={{ color: "red" }}>
                Page for "{tenantName}" does not exist. Please check the URL.
              </p>
            ) : (
              <p className="mb-2">
                Redirecting to the home page in <strong>{countdown}</strong>{" "}
                seconds
              </p>
            )}
            {tenantExists !== false && (
              <Button
                tag={Link}
                to="/"
                color="primary"
                className="btn-sm-block mb-2"
              >
                Back to Home
              </Button>
            )}
            <img
              className="img-fluid"
              src={source}
              alt="Page not found"
              onError={(e) => (e.target.src = "/fallback-image.svg")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
