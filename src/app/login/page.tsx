
"use client";

import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  // STATE VARIABLES

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
const router = useRouter();
const [isLoading, setIsLoading] =
  useState(false);
  // CAPTCHA TOKEN STATE

//   const [captchaToken, setCaptchaToken] =
//     useState<string | null>(null);

  // FORM SUBMIT FUNCTION

 const handleLogin = async (
  e: React.FormEvent
) => {

  e.preventDefault();
  setIsLoading(true);

  try {

    const response =
      await fetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    const data =
      await response.json();

    console.log(data);

    if (response.ok) {

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  toast.success(
    "Login successful"
  );

  router.replace(
    "/dashboard"
  );

  router.refresh();

} else {

  toast.error(
    data.message
  );

}

  } catch (error) {

    console.log(error);

    toast.error(
      "Something went wrong"
    );
  } finally {
    setIsLoading(false);
  }
};
                                     
    // CHECK CAPTCHA


// toast.error(
//   "Please complete CAPTCHA"
// );


//     const response = await fetch(
//          "/api/login", 
//          {
//              method: "POST",
//               headers: { 
//                 "Content-Type": "application/json", 
//             },
//              body: JSON.stringify({ email,
//                  password, captchaToken,
//                  }), 
//                 }
//              );
//               const data = 
//               await response.json(); 
              
// if (data.success) {

//   toast.success(
//     data.message
//   );

// } else {

//   toast.error(
//     data.message
//   );
// }

//             };

  return (

    <div className="min-h-screen flex items-center justify-center
bg-gray-100">

      <form
        onSubmit={handleLogin}
className="w-full max-w-md
bg-white border border-gray-200 rounded-3xl shadow-2xl p-8"
      >

        <h1
className="text-4xl font-extrabold text-black text-center mb-6">
          Login
        </h1>

        {/* EMAIL INPUT */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-gray-50 border border-gray-300 text-black placeholder-gray-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-white mb-4"
        />

        {/* PASSWORD INPUT */}

        <input
          type="password"
          placeholder="Enter Password"
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

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={isLoading}
className="w-full
bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
{isLoading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}
  
