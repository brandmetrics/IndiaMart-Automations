"use client";

import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";


export default function RegisterPage() {

  // STATES

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

  // REGISTER FUNCTION

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    console.log(
      "Register button clicked"
    );

    // CAPTCHA CHECK

// if (!captchaToken) {

//   toast.error(
//     "Please complete CAPTCHA"
//   );

//   return;
// }


    // API REQUEST

    const response =
      await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
            // captchaToken,
          }),
        }
      );

    const data =
      await response.json();

     
if (data.success) {

  toast.success(
    data.message
  );

} else {

  toast.error(
    data.message
  );
}

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleRegister}
        className="w-[400px] bg-white border border-gray-200 p-8 rounded-3xl shadow-2xl"
      >

        <h1
className="text-4xl font-extrabold text-black text-center mb-6"
>
          Register
        </h1>

        {/* USERNAME */}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
className="w-full bg-gray-50 border border-gray-300 text-black placeholder-gray-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white mb-4"
        />

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
className="w-full bg-gray-50 border border-gray-300 text-black placeholder-gray-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white mb-4"
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-gray-50 border border-gray-300 text-black placeholder-gray-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white mb-4"
        />

        {/* CAPTCHA */}

        {/* <div className="mb-4">

          <ReCAPTCHA
            sitekey={
              process.env
                .NEXT_PUBLIC_RECAPTCHA_SITE_KEY!
            }

            onChange={(token) =>
              setCaptchaToken(token)
            }
          />

        </div> */}

        {/* BUTTON */}

        <button
          type="submit"
className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all duration-300"

        >
          Register
        </button>

      </form>

    </div>
  );
}
