import emailjs from "@emailjs/browser";
import { FormEvent, useEffect, useState } from "react";
import Loader from "./loader";
import { format } from "date-fns";
const today = new Date();

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"edit" | "loading" | "sent" | "failed">(
    "edit"
  );

  emailjs.init({
    publicKey: "cdUZZqjrGrJht5EToS",
  });

  useEffect(() => {
    verify();
  }, [name, email, phone, subject, message]);

  function verify() {
    if (!name) setErrorMessage("Enter name");
    else if (!email) setErrorMessage("Enter email");
    else if (email.indexOf("@") === -1 || email.length <= 5)
      setErrorMessage("Enter a valid email");
    else if (!phone) setErrorMessage("Enter phone number");
    else if (String(phone).length !== 10)
      setErrorMessage("Enter a valid phone number");
    else if (!subject) setErrorMessage("Enter subject");
    else if (!message) setErrorMessage("Enter message");
    else setErrorMessage("");
    if (status === "failed") setStatus("edit");
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!errorMessage) {
      setStatus("loading");
      emailjs
        .send("service_hawwbzl","template_pms1q86", {
          subject,
          name,
          time: format(today, "EEE, dd MMM yyyy HH:mm:ss 'GMT',"),
          email,
          phone,
          message,
        })
        .then(() => {
          setStatus("sent");
          setName("");
          setEmail("");
          setPhone(0);
          setSubject("");
          setMessage("");
          setTimeout(() => setStatus("edit"), 2500);
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setStatus("failed");
        });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 portrait:pb-16 gap-8 ">
      {status === "loading" && (
        <div className="w-screen h-screen absolute z-50 top-0 left-0 backdrop-blur-sm flex flex-col gap-4 justify-center items-center">
          <Loader />
          <div className="font-bold text-slate-800">Sending...</div>
        </div>
      )}

      <div
        className={`absolute z-50 bottom-4 right-4 bg-green-500 pointer-events-none px-16 py-4 rounded-md ${
          status === "sent"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <div className="font-bold text-white">Sent !</div>
      </div>

      {/* Removed Logo and Added Title */}
      <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide drop-shadow-md">
        FEEDBACK FORM
      </h1>

      <form
        className="w-full h-full landscape:border border-neutral-400 rounded-md flex flex-col items-center justify-center landscape:p-8 gap-4 bg-white shadow-xl p-6"
        onSubmit={submit}
      >
        <div className="w-full flex gap-4 portrait:flex-col">
          <input
            type="text"
            id="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="w-full flex gap-4 portrait:flex-col">
          <input
            type="number"
            id="phone"
            placeholder="Enter Phone Number"
            value={phone === 0 ? "" : phone}
            onChange={(e) => setPhone(Number(e.target.value.substring(0, 10)))}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            id="subject"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <textarea
          className="w-full portrait:h-full landscape:h-[16vh] border border-neutral-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div id="error-message" className="text-red-500 font-medium text-base self-start">
          {errorMessage}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out text-white font-bold rounded-lg shadow-md"
          disabled={errorMessage !== "" && status !== "failed"}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
